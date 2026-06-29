import { useShow } from "@refinedev/core";
import { Show, MarkdownField } from "@refinedev/antd";
import { Typography } from "antd";
import type { Note } from "../../shapes/orm/post.typings";

const { Title, Text } = Typography;

export const PostShow = () => {
  const { query: queryResult } = useShow<Note>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Id</Title>
      <Text>{record?.['@graph']}</Text>
      <Title level={5}>Title</Title>
      <Text>{record?.title}</Text>
      <Title level={5}>Content</Title>
      <MarkdownField value={record?.content} />
    </Show>
  );
};
