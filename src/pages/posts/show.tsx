import { useCallback } from "react";
import { useShow, useNavigation, useNotification, type LiveEvent } from "@refinedev/core";
import { Show, MarkdownField } from "@refinedev/antd";
import { Typography } from "antd";
import type { Note } from "../../shapes/orm/post.typings";

const { Title, Text } = Typography;

export const PostShow = () => {
  const { list } = useNavigation();
  const { open } = useNotification();

  const onLiveEvent = useCallback((event: LiveEvent) => {
    if (event.type === "deleted") {
      open?.({
        type: "error",
        message: "This post has been deleted",
      });
      list("posts");
    }
  }, [open, list]);

  const { query: queryResult } = useShow<Note>({ liveMode: "auto", onLiveEvent });
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
