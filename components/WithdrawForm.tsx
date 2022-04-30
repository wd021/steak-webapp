import { useDisclosure, Box, Button, Text } from "@chakra-ui/react";
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { FC } from "react";

import Header from "./Header";
import AssetInput from "./AssetInput";
import TxModal from "./TxModal";
import { useBalances, useConstants, usePrices, useWithdrawableAmount } from "../hooks";
import { MsgExecuteContract } from "@terra-money/terra.js";

const WithdrawForm: FC = () => {
  const wallet = useConnectedWallet();
  const prices = usePrices();
  const balances = useBalances();
  const withdrawableAmount = useWithdrawableAmount(); // NOTE: the withdrawable amount is in `uluna`, not Luna
  const { contracts } = useConstants(wallet?.network.name);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const msgs = wallet && contracts
    ? [
        new MsgExecuteContract(wallet.terraAddress, contracts.steakHub, {
          withdraw_unbonded: {},
        }),
      ]
    : [];

  return (
    <Box maxW="container.sm" mx="auto">
      <Header text="Withdrawable LUNA Amount" />
      <AssetInput
        assetSymbol="LUNA"
        assetLogo="/luna.png"
        price={prices.luna}
        balance={balances ? balances.uluna / 1e6 : 0}
        isEditable={false}
        fixedAmount={withdrawableAmount / 1e6}
      />
      <Box textAlign="center">
        <Button
          type="button"
          variant="primary"
          mt="6"
          onClick={onOpen}
          isLoading={false}
          isDisabled={!wallet || withdrawableAmount == 0}
        >
          Withdraw
        </Button>
        <Text mt="3" textStyle="small" variant="dimmed" textAlign="center">
          {""}
        </Text>
        <TxModal isOpen={isOpen} onClose={onClose} msgs={msgs} />
      </Box>
    </Box>
  );
};

export default WithdrawForm;
