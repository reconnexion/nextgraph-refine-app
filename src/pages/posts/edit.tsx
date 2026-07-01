import React, { useState } from "react";
import { Edit, useForm, ListButton, RefreshButton } from "@refinedev/antd";
import { Alert, Form, Input } from "antd";
import MDEditor from "@uiw/react-md-editor";
import type { Note } from "../../shapes/orm/post.typings";

export const PostEdit = () => {
  const [deprecated, setDeprecated] = useState<
    "deleted" | "updated" | undefined
  >();
  // const [queryEnabled, setQueryEnabled] = useState(true);

  const { formProps, saveButtonProps, query: queryResult } = useForm<Note>({
    liveMode: 'manual',
    onLiveEvent: (event) => {
      console.log('onLiveEvent', event);
      if (event.type === "deleted" || event.type === "updated") {
        setDeprecated(event.type);
      }
    },
    // queryOptions: { enabled: queryEnabled },
  });

  // Disable the query after the initial successful load to prevent any
  // automatic refetch (from cache invalidation or subscriptions) from
  // resetting the form while the user is editing.
  // React.useEffect(() => {
  //   if (queryResult?.isSuccess && queryEnabled) {
  //     setQueryEnabled(false);
  //   }
  // }, [queryResult?.isSuccess, queryEnabled]);

  const handleRefresh = () => {
    queryResult?.refetch();
    setDeprecated(undefined);
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        {deprecated === "deleted" && (
          <Alert
            message="This post has been deleted."
            type="warning"
            style={{ marginBottom: 20 }}
            action={<ListButton size="small" />}
          />
        )}
        {deprecated === "updated" && (
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
