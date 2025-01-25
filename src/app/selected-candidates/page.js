import React from 'react'
import SelectedCandidates from '../../components/selectedCandidates/SelectedCandidates'

import Layout from '../../components/layout'

const page = () => {
  return (
    <Layout>
      <div>
        <SelectedCandidates />
      </div>
    </Layout>
  )
}

export default page