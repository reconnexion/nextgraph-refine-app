import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Table, Space } from "antd";
import type { Note } from "../../shapes/orm/post.typings";

export const PostList = () => {
  const { tableProps } = useTable<Note>();
  const { show } = useNavigation();

  return (
    <List headerButtons={<CreateButton />}>
      <Table
        {...tableProps}
        rowKey="@graph"
        onRow={(record) => ({
          onClick: () => show("posts", record["@graph"]),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="@graph" title="ID" />
        <Table.Column<Note>
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space onClick={(e) => e.stopPropagation()}>
              <EditButton hideText size="small" recordItemId={record['@graph']} />
              <ShowButton hideText size="small" recordItemId={record['@graph']} />
              <DeleteButton hideText size="small" recordItemId={record['@graph']} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
