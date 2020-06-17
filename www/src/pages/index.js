import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Documentation from "../components/documentation"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query pageQuery {
      allMarkdownRemark {
        edges {
          node {
            html
          }
        }
      }
    }
  `)

  const {
    allMarkdownRemark: { edges },
  } = data

  return (
    <Layout>
      <SEO title="Home" />
      <Documentation data={edges[0].node.html} />
    </Layout>
  )
}

export default IndexPage
