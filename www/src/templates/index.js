import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Documentation from "../components/documentation"

const IndexPage = ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout data={post}>
      <SEO title="Home" />
      <Documentation data={post.html} />
    </Layout>
  )
}

export default IndexPage

// highlight-start
export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      tableOfContents(absolute: false, heading: "", maxDepth: 2)
    }
  }
`
// highlight-end
