import { Fragment } from "react";
import { useSnapshot } from "valtio";
import { Col, Divider, Row, Text, Code } from "@nextui-org/react";
import { getSdkError } from "@walletconnect/utils";

import ModalStore from "../store/ModalStore";
import SettingsStore from "../store/SettingsStore";
// import { eip155Addresses, eip155Wallets } from "../lib/EIP155WalletUtil";

import RequestModal from "./RequestModal";
import { web3wallet } from "../lib/walletConnect";
import { signMessage } from "wagmi/actions";

export default function AuthRequestModal() {
  // const { account } = useSnapshot(SettingsStore.state);
  // console.log("modal data", ModalStore.state.data, account);
  // Get request and wallet data from store
  const request = ModalStore.state.data?.request;
  // Ensure request and wallet are defined
  if (!request) {
    return <Text>Missing request data</Text>;
  }

  const activeChain = SettingsStore.state.activeChain;
  const tbaAddress = SettingsStore.state.tbaAddress;
  const iss = `did:pkh:eip155:${activeChain.id}:${tbaAddress}`;

  // Get required request data
  const { params } = request;

  const message = web3wallet.formatMessage(params.cacaoPayload, iss);

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (request) {
      // const signature = await client.signMessage(message);
      const signature = await signMessage({ message });
      await web3wallet.respondAuthRequest(
        {
          id: request.id,
          signature: {
            s: signature as string,
            t: "eip1271",
          },
        },
        iss
      );
      ModalStore.close();
    }
  }

  // Handle reject action
  async function onReject() {
    if (request) {
      await web3wallet.respondAuthRequest(
        {
          id: request.id,
          error: getSdkError("USER_REJECTED"),
        },
        iss
      );
      ModalStore.close();
    }
  }
  return (
    <RequestModal
      intention="request a signature"
      metadata={request.params.requester.metadata}
      onApprove={onApprove}
      onReject={onReject}
    >
      <Row>
        <Col>
          <h5>Message</h5>
          <Code>
            <Text color="$gray400">{message}</Text>
          </Code>
        </Col>
      </Row>
    </RequestModal>
  );
}
