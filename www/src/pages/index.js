import React from "react"
import { Link, graphql } from "gatsby" // highlight-line

export default function Home({ data }) {
  return (
    <div>
      <h1>IAM Policies</h1>
      <h4>{data.allMarkdownRemark.totalCount} Translations</h4>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          {/* highlight-start */}
          <Link to={node.fields.slug}>
            {/* highlight-end */}
            <h3>
              {node.frontmatter.title} <span>— {node.frontmatter.date}</span>
            </h3>
          </Link>{" "}
          {/* highlight-line */}
        </div>
      ))}
    </div>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          html
          frontmatter {
            title
            date
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
