// @flow
export type TAttr = {
    name: string,
}

export const equals = (x: TAttr, y: TAttr) => x.name === y.name
