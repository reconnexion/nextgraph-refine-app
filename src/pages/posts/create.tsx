import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import MDEditor from "@uiw/react-md-editor";
import type { Note } from "../../shapes/orm/post.typings";

export const PostCreate = () => {
  const { formProps, saveButtonProps } = useForm<Note>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Enter a post title" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
      </Form>
    </Create>
  );
};
