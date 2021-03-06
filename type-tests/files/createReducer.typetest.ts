import { Reducer } from 'redux'
import { createReducer, createAction, ActionReducerMapBuilder } from '../../src'

function expectType<T>(p: T) {}

/*
 * Test: createReducer() infers type of returned reducer.
 */
{
  type CounterAction =
    | { type: 'increment'; payload: number }
    | { type: 'decrement'; payload: number }

  const incrementHandler = (state: number, action: CounterAction) => state + 1
  const decrementHandler = (state: number, action: CounterAction) => state - 1

  const reducer = createReducer(0 as number, {
    increment: incrementHandler,
    decrement: decrementHandler
  })

  const numberReducer: Reducer<number> = reducer

  // typings:expect-error
  const stringReducer: Reducer<string> = reducer
}

/**
 * Test: createReducer() state type can be specified expliclity.
 */
{
  type CounterAction =
    | { type: 'increment'; payload: number }
    | { type: 'decrement'; payload: number }

  const incrementHandler = (state: number, action: CounterAction) =>
    state + action.payload

  const decrementHandler = (state: number, action: CounterAction) =>
    state - action.payload

  createReducer<number>(0, {
    increment: incrementHandler,
    decrement: decrementHandler
  })

  // typings:expect-error
  createReducer<string>(0, {
    increment: incrementHandler,
    decrement: decrementHandler
  })
}

/** Test:  alternative builder callback for actionMap */
{
  const increment = createAction<number, 'increment'>('increment')

  const reducer = createReducer(0, builder =>
    expectType<ActionReducerMapBuilder<number>>(builder)
  )

  expectType<number>(reducer(0, increment(5)))
  // typings:expect-error
  expectType<string>(reducer(0, increment(5)))
}
