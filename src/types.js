// @flow

export type Configuration = {
    features: Feature
}

export type Context = {
    rules: Rules,
    [name: string]: mixed
}

export type Feature = {
    [name:string]: mixed
}

export type Rule = (context: Context, *) => boolean

export type Rules = {
    [name: string]: Rule
}
