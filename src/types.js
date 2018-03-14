// @flow

export type Configuration = {
    features: Features
}

export type Context = {
    rules: Rules,
    [name: string]: mixed
}

export type Features = {
    [name:string]: mixed
}

export type Rule = (context: Context, *) => boolean

export type Rules = {
    [name: string]: Rule
}

type RouterIsEnabledFunc = (context: Context, rules: Rules, feature: string) => boolean;

export type LocalRouter = {
    type: 'LOCAL',
    isEnabled: RouterIsEnabledFunc,
}

export type Router = LocalRouter;
