import { Col, Divider, Link, Text, styled } from "@nextui-org/react";
import { CoreTypes } from "@walletconnect/types";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

import RequestModalContainer from "../components/RequestModalContainer";

interface IProps {
  metadata: CoreTypes.Metadata;
  onApprove: () => void;
  onReject: () => void;
}

const StyledLink = styled("span", {
  color: "#697177",
} as any);

const StyledProceedButton = styled("p", {
  margin: "10px auto",
  padding: "10px",
  color: "$error",
  cursor: "pointer",
} as any);

const StyledCloseButton = styled("p", {
  margin: "auto",
  padding: "10px",
  border: "1px solid $error",
  borderRadius: "30px",
} as any);

export default function ThreatPrompt({
  metadata,
  onApprove,
  onReject,
}: IProps) {
  const { url } = metadata;

  return (
    <RequestModalContainer title="">
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div className="flex flex-row">
          <Col>
            <NewReleasesIcon
              sx={{ fontSize: "55px", color: "$error" }}
              color="error"
            />
          </Col>
        </div>
        <div style={{ alignContent: "center" }}>
          <Col>
            <Text h3>Website flagged</Text>
          </Col>
        </div>
        <div style={{ alignContent: "center" }}>
          <Col>
            <Link
              style={{ verticalAlign: "middle" }}
              href={url}
              data-testid="session-info-card-url"
            >
              <StyledLink>{url}</StyledLink>
            </Link>
          </Col>
        </div>
        <div style={{ textAlign: "center" }}>
          <Divider y={1} />
          <Text>
            This website you`re trying to connect is flagged as malicious by
            multiple security providers. Approving may lead to loss of funds.
          </Text>
          <div>
            <StyledProceedButton color="$error" onClick={onApprove}>
              Proceed anyway
            </StyledProceedButton>
          </div>
          <div>
            <Col
              span={10}
              style={{ margin: "auto", cursor: "pointer" }}
              onClick={onReject}
            >
              <StyledCloseButton>Close</StyledCloseButton>
            </Col>
          </div>
        </div>
      </div>
    </RequestModalContainer>
  );
}
