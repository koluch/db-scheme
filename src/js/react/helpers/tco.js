import type {TAttr} from '~/types/TAttr'
import type {TTable} from '~/types/TTable'

// todo: reimplement as selector
export const isAttrProperForeignKeyTarget = (fromTable: TTable, fromAttr: TAttr, toTable: TTable, toAttr: TAttr): boolean => {
    return fromTable.name !== toTable.name
}
