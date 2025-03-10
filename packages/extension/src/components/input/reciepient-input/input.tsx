import React from "react";
import { TextInput } from "../text-input";
import { observer } from "mobx-react-lite";
import {
  EmptyAddressError,
  IMemoConfig,
  IRecipientConfig,
  IRecipientConfigWithICNS,
} from "@keplr-wallet/hooks";
import { ProfileIcon } from "../../icon";
import { Box } from "../../box";
import { AddressBookModal } from "../../address-book-modal";
import { IconButton } from "../../icon-button";
import { ColorPalette } from "../../../styles";
import { useStore } from "../../../stores";

export interface RecipientInputWithAddressBookProps {
  historyType: string;
  recipientConfig: IRecipientConfig | IRecipientConfigWithICNS;
  memoConfig: IMemoConfig;
}

export interface RecipientInputWithoutAddressBookProps {
  recipientConfig: IRecipientConfig | IRecipientConfigWithICNS;
  memoConfig?: undefined;

  hideAddressBookButton: true;
}

export type RecipientInputProps =
  | RecipientInputWithAddressBookProps
  | RecipientInputWithoutAddressBookProps;

function numOfCharacter(str: string, c: string): number {
  return str.split(c).length - 1;
}

export const RecipientInput = observer<RecipientInputProps, HTMLInputElement>(
  (props, ref) => {
    const { analyticsStore } = useStore();
    const { recipientConfig, memoConfig } = props;

    const [isAddressBookModalOpen, setIsAddressBookModalOpen] =
      React.useState(false);

    const isICNSName: boolean = (() => {
      if ("isICNSName" in recipientConfig) {
        return recipientConfig.isICNSName;
      }
      return false;
    })();

    const isICNSFetching: boolean = (() => {
      if ("isICNSFetching" in recipientConfig) {
        return recipientConfig.isICNSFetching;
      }
      return false;
    })();

    return (
      <Box>
        <TextInput
          ref={ref}
          label="Wallet Address"
          value={recipientConfig.value}
          autoComplete="off"
          onChange={(e) => {
            let value = e.target.value;

            if (
              // If icns is possible and users enters ".", complete bech32 prefix automatically.
              "isICNSEnabled" in recipientConfig &&
              recipientConfig.isICNSEnabled &&
              value.length > 0 &&
              value[value.length - 1] === "." &&
              numOfCharacter(value, ".") === 1 &&
              numOfCharacter(recipientConfig.value, ".") === 0
            ) {
              value = value + recipientConfig.icnsExpectedBech32Prefix;
            }

            recipientConfig.setValue(value);

            e.preventDefault();
          }}
          right={
            memoConfig ? (
              <IconButton
                onClick={() => {
                  analyticsStore.logEvent("click_addressBookButton");
                  setIsAddressBookModalOpen(true);
                }}
                hoverColor={ColorPalette["gray-500"]}
                padding="0.25rem"
              >
                <ProfileIcon width="1.5rem" height="1.5rem" />
              </IconButton>
            ) : null
          }
          isLoading={isICNSFetching}
          paragraph={(() => {
            if (isICNSName && !recipientConfig.uiProperties.error) {
              return recipientConfig.recipient;
            }
          })()}
          error={(() => {
            const uiProperties = recipientConfig.uiProperties;

            const err = uiProperties.error || uiProperties.warning;

            if (err instanceof EmptyAddressError) {
              return;
            }

            if (err) {
              return err.message || err.toString();
            }
          })()}
        />

        {memoConfig ? (
          <AddressBookModal
            isOpen={isAddressBookModalOpen}
            close={() => setIsAddressBookModalOpen(false)}
            historyType={props.historyType}
            recipientConfig={recipientConfig}
            memoConfig={memoConfig}
          />
        ) : null}
      </Box>
    );
  },
  {
    forwardRef: true,
  }
);
