import type { CSSProperties } from "react";

import {
  type LoginPageProps,
  type LoginFormTypes,
} from "@refinedev/core";
import {
  Row,
  Col,
  Layout,
  Card,
  Form,
  Input,
  Button,
  type CardProps,
  type LayoutProps,
  type FormProps,
  theme,
} from "antd";
import { useLogin, useTranslate } from "@refinedev/core";
import { ThemedTitle } from "@refinedev/antd";

export const layoutStyles: CSSProperties = {};

export const containerStyles: CSSProperties = {
  maxWidth: "400px",
  margin: "auto",
  padding: "32px",
  boxShadow:
    "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px rgba(0, 0, 0, 0.03)",
};

export const headStyles: CSSProperties = {
  borderBottom: 0,
  padding: 0,
};

export const bodyStyles: CSSProperties = { padding: 0 };

export const titleStyles: CSSProperties = {
  textAlign: "center",
  marginBottom: 0,
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: 700,
  overflowWrap: "break-word",
  hyphens: "manual",
  textOverflow: "unset",
  whiteSpace: "pre-wrap",
};

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;

export const AuthPage: React.FC<LoginProps> = ({
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
  mutationVariables,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();

  const { mutate: login, isPending } = useLogin<LoginFormTypes>();

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title ?? <ThemedTitle collapsed={false} />}
      </div>
    );

  const CardContent = (
    <Card
      // title={CardTitle}
      styles={{
        header: headStyles,
        body: bodyStyles,
      }}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
      {...(contentProps ?? {})}
    >
      <Form<LoginFormTypes>
        layout="vertical"
        form={form}
        onFinish={(values) => login({ ...values, ...mutationVariables })}
        requiredMark={false}
        initialValues={{
          brokerUrl: 'https://nextgraph.eu'
        }}
        {...formProps}
      >
        <Form.Item
          name="brokerUrl"
          label={translate("pages.login.fields.brokerUrl", "Broker URL")}
          rules={[
            {
              required: true,
              message: translate(
                "pages.login.errors.requiredBrokerUrl",
                "Broker URL is required",
              ),
            },
            {
              type: "url",
              message: translate(
                "pages.login.errors.validBrokerUrl",
                "Invalid broker URL",
              ),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={translate("pages.login.fields.brokerUrl", "Broker URL")}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isPending}
            block
          >
            {translate("pages.login.signin", "Sign in")}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align={hideForm ? "top" : "middle"}
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: hideForm ? "15dvh" : "16px",
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContent, PageTitle)
          ) : (
            <>
              {PageTitle}
              {CardContent}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthPage;