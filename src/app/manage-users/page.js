import React from 'react'
import ManageUser from '../../components/users/ManageUser'

import Layout from '../../components/layout'

const page = () => {
  return (
    <Layout>
      <div>
        <ManageUser />
      </div>
    </Layout>
  )
}

export default page