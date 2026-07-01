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

const shortenNuri = (nuri: string) => {
  return nuri?.split(':')[3]?.slice(0, 7);
};

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
        <Table.Column dataIndex="@graph" title="ID" render={shortenNuri} />
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="content" title="Content" />
        <Table.Column<Note>
          title="Actions"
          dataIndex="actions"
          align="right"
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
