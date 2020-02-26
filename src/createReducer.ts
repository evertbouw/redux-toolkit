import { AnyAction, Action, Reducer } from 'redux'
import {
  executeReducerBuilderCallback,
  ActionReducerMapBuilder
} from './mapBuilders'

/**
 * Defines a mapping from action types to corresponding action object shapes.
 *
 * @deprecated This should not be used manually - it is only used for internal
 *             inference purposes and should not have any further value.
 *             It might be removed in the future.
 * @public
 */
export type Actions<T extends keyof any = string> = Record<T, Action>

/**
 * An *case reducer* is a reducer function for a specific action type. Case
 * reducers can be composed to full reducers using `createReducer()`.
 *
 * Unlike a normal Redux reducer, a case reducer is never called with an
 * `undefined` state to determine the initial state. Instead, the initial
 * state is explicitly specified as an argument to `createReducer()`.
 *
 * @public
 */
export type CaseReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => S

/**
 * A mapping from action types to case reducers for `createReducer()`.
 *
 * @deprecated This should not be used manually - it is only used
 *             for internal inference purposes and using it manually
 *             would lead to type erasure.
 *             It might be removed in the future.
 * @public
 */
export type CaseReducers<S, AS extends Actions> = {
  [T in keyof AS]: AS[T] extends Action ? CaseReducer<S, AS[T]> : void
}

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 *
 * @param initialState The initial state to be returned by the reducer.
 * @param actionsMap A mapping from action types to action-type-specific
 *   case reducers.
 *
 * @public
 */
export function createReducer<
  S,
  CR extends CaseReducers<S, any> = CaseReducers<S, any>
>(initialState: S, actionsMap: CR): Reducer<S>
/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 *
 * @param initialState The initial state to be returned by the reducer.
 * @param builderCallback A callback that receives a *builder* object to define
 *   case reducers via calls to `builder.addCase(actionCreatorOrType, reducer)`.
 *
 * @public
 */
export function createReducer<S>(
  initialState: S,
  builderCallback: (builder: ActionReducerMapBuilder<S>) => void
): Reducer<S>

export function createReducer<S>(
  initialState: S,
  mapOrBuilderCallback:
    | CaseReducers<S, any>
    | ((builder: ActionReducerMapBuilder<S>) => void)
): Reducer<S> {
  let actionsMap =
    typeof mapOrBuilderCallback === 'function'
      ? executeReducerBuilderCallback(mapOrBuilderCallback)
      : mapOrBuilderCallback

  return function(state = initialState, action): S {
    const reducer = actionsMap[action.type]
    return reducer === undefined ? state : reducer(state, action)
  }
}
