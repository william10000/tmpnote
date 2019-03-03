// @flow

import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import stateful from '../lib/stateful'
import { decrypt } from '../lib/crypto'
import * as api from '../lib/api'
import { Logo } from '../atoms'
import { Message } from '../molecules'
import * as Note from '../organisms/Note'

import type { Update, Action } from '../lib/stateful'

const Page: (*) => React$Element<*>
= styled.div`
  position: relative;
  height: 100vh;
  max-height: 100%;
  overflow-y: hidden;
  background: ${props => props.theme.primary(100)};
`

const Container: (*) => React$Element<*>
= styled.div`
  display: grid;
  grid-template-rows: 20% 30% 1fr 60px;

  height: calc(100% - 20px);
  max-width: 800px;
  margin: 0px auto 20px;
  padding: 0 10px;

  & div {
    align-self: center;
    text-align: center;
  }

  & button {
    grid-row: 4;
  }
`

type State =
  | {| screen: 'initial' |}
  | {| screen: 'fetching' |}
  | {| screen: 'fetched', note: string |}
  | {| screen: 'not-found' |}
  | {| screen: 'error', error: string |}

type Props = {
  update: Update<State>,
  state: State,
  match: {
    params: {
      id: string,
    }
  },
  location: {
    hash: string,
  },
}

const fetchNote: Action<State, ({ id: string, secret: string }) => Promise<void>>
= ({ update, state }) => async ({ id, secret }) => {
  update({ screen: 'fetching' })

  try {
    const { note } = await api.read(id)
    if (note) {
      const decrypted = decrypt({ secret, cipher: note })
      update({ screen: 'fetched', note: decrypted })
    } else {
      update({ screen: 'not-found' })
    }
  } catch (err) {
    update({ screen: 'error', error: err })
  }
}

const Screen: (Props) => React$Element<*>
= ({ state, update, match: { params }, location: { hash }}) => {
  switch (state.screen) {
    case 'initial':
      fetchNote({ update, state })({ id: params.id, secret: hash.slice(1) })
      return <div />
    case 'fetching':
      return <div />
    case 'fetched':
      return <Note.Show note={state.note} />
    case 'error':
      return <Message title="Error" body="Couldn't decrypt - but we deleted the note anyway." />
    case 'not-found':
      return <Message title="Not Found" body="If you expected to see the note here, it may have already been read." />
    default:
      throw new Error('impossible')
  }
}


const ReadNote: (Props) => React$Element<*>
= (props) => (
  <Page>
    <Helmet title="tmp/note - Create & share encrypted notes" />
    <Container>
      <Logo />
      <Screen {...props} />
    </Container>
  </Page>
)

export default stateful({ screen: 'initial' })(ReadNote)
