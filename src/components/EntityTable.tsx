import { DocumentField } from "@/types/document.types";
import { Table, Text } from "@radix-ui/themes";

type EntityTableProps = {
    entities?: DocumentField[];
    hideBlankEntities?: boolean;
};

const EntityTable = ({
    entities,
    hideBlankEntities = false,
}: EntityTableProps) => {
    if (!entities || !entities.length) {
        return (
            <Text color="gray">
                <em>No fields found</em>
            </Text>
        );
    }

    // Filter entities if hideBlankEntities is true
    const displayedEntities = hideBlankEntities
        ? entities.filter(entity => entity.value?.trim())
        : entities;

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Label</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Confidence</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {displayedEntities.map(({ value, label, confidence }, i) => (
                    <Table.Row
                        key={`${i}-${label}`}
                        style={{
                            color:
                                confidence > 80 ? undefined : "var(--gray-9)",
                        }}
                    >
                        <Table.RowHeaderCell>{label}</Table.RowHeaderCell>
                        <Table.Cell
                            style={{
                                wordWrap: "break-word",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                            }}
                        >
                            {value}
                        </Table.Cell>
                        <Table.Cell>{(confidence ?? 0).toFixed(2)}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
};

export default EntityTable;
