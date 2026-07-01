import React, { useCallback, useState } from "react";
import { Edit, useForm, RefreshButton } from "@refinedev/antd";
import { useNavigation, useNotification, type LiveEvent } from "@refinedev/core";
import { Alert, Form, Input } from "antd";
import MDEditor from "@uiw/react-md-editor";
import type { Note } from "../../shapes/orm/post.typings";

export const PostEdit = () => {
  const [deprecated, setDeprecated] = useState<boolean>(false);

  const { list } = useNavigation();
  const { open } = useNotification();

  const onLiveEvent = useCallback((event: LiveEvent) => {
    console.log('onLiveEvent', event);
    if (event.type === "deleted") {
      open?.({
        type: "error",
        message: "This post has been deleted",
      });
      list("posts");
    } else if (event.type === "updated") {
      setDeprecated(true);
    }
  }, [open, list]);

  const { formProps, saveButtonProps, query: queryResult } = useForm<Note>({
    liveMode: 'manual',
    onLiveEvent,
  });

  const handleRefresh = () => {
    queryResult?.refetch();
    setDeprecated(false);
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        {deprecated && (
          <Alert
            message="This post has been updated. Refresh to see changes."
            type="warning"
            style={{ marginBottom: 20 }}
            action={<RefreshButton size="small" onClick={handleRefresh} />}
          />
        )}
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
