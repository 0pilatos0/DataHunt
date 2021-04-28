import Item from "../Item";

export default interface IDictionary{
    [key: string]: any
}

export interface IFunctionDictionary{
    [key: string]: Array<Function>
}

export interface IItemDictionary{
    [key: string]: Item
}