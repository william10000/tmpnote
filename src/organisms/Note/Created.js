// @flow

import React from 'react'
import styled from 'styled-components'
import { CopyLink } from '../../molecules'
import stateful from '../../lib/stateful'

import type { Update, Action } from '../../lib/stateful'

const Container: (*) => React$Element<*>
= styled.div`
  padding: 0;
  text-align: center;
  height: 100vh;

  margin: 10vh auto;
  width: 100%;

  @media (min-width: 667px) {
    margin: 20vh auto;
  }

  & div {
    height: fit-content;
  }

  & a {
    cursor: pointer;
    color: ${props => props.theme.error};
    font-weight: 500;
    padding: 10px;
    border-radius: 3px;
    transition: 0.03s box-shadow, 0.3s background-color, 0.3s color, 0.3s border, 0.03s ease-in-out transform;

    &:hover {
      background: ${props => props.theme.error};
      color: ${props => props.theme.white};
      box-shadow: 0 12px 10px -10px ${props => props.theme.shadow};
    }

    &:active {
      transform: translateY(2px);
      box-shadow: 0 2px 10px -3px ${props => props.theme.shadow};
    }
  }
`

type State = 'initial' | 'submitting'

type Props = {
  id: string,
  secret: string,
  onDelete: (string) => *,
  update: Update<State>,
  state: State,
}

const handleDelete: Action<State, ({ onDelete: *, id: string }) => void>
= ({ update, state }) => ({ onDelete, id }) => {
  update('submitting')
  onDelete(id)
}

const Created: (Props) => React$Element<*>
= ({ id, secret, onDelete, update, state }) => (
  <Container>
    <CopyLink link={`${window.location.host}/n/${id}#${secret}`} />

    <a onClick={() => handleDelete({ update, state })({ onDelete, id })}>
      Changed your mind? Delete it Now.
    </a>
  </Container>
)

export default stateful('initial')(Created)
