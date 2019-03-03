// @flow

import React from 'react'
import styled from 'styled-components'
import { Message } from '../../molecules'

const Container: (*) => React$Element<*>
= styled.div`
  padding: 0;
  text-align: center;

  max-height: 50vh;
  margin: auto;
  width: 100%;
  max-width: 800px;

  & > div {
    height: fit-content;
    margin-bottom: 100px;
  }

  & > button {
    max-width: 380px;
    margin: 0 auto;
  }
`

type Props = {
}

const Deleted: (Props) => React$Element<*>
= (props) => (
  <Container>
    <Message title="Deleted." body="It's gone forever now. 💔" />
  </Container>
)

export default Deleted

