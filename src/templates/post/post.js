/* Vendor imports */
import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
/* App imports */
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import TagList from '../../components/tag-list'
import Article from './article'
import Comments from './comments'
import Share from './share'
import SuggestedPosts from './suggested-posts'
import Utils from '../../utils'
import * as style from './post.module.less'

const Post = ({ data }) => {

  const { html, excerpt, frontmatter } = data.markdownRemark
  const { title, date, tags, cover, coverAlt, path } = frontmatter
  const img = cover.childImageSharp.fluid
  const canonicalUrl = Utils.resolvePageUrl(data.site.siteMetadata.hostname, data.site.pathPrefix, path)
  const coverUrl = Utils.resolveUrl(data.site.siteMetadata.hostname, img.src)
  const tagPagePath = data.site.siteMetadata.pages.tag;
  const suggestedPosts = Utils.getSuggestedPosts(data.markdownRemark, data.allMarkdownRemark, 3)

  return (
    <Layout>
      <SEO
        title={title}
        description={excerpt}
        path={path}
        contentType={'article'}
        image={{url: img.src, alt: coverAlt}}
        keywords={tags}
      />
      <div>
        <div className={style.header}>
          <div className={style.title}>
            <label>{date}</label>
            <h1>{title}</h1>
            <TagList tags={tags} tagPagePath={tagPagePath} position="center" />
          </div>
          <div className={style.cover}>
            <Img fluid={img} title={title}/>
          </div>
        </div>
        <div className={style.content}>
          <Article html={html} />
          <Share
            pageCanonicalUrl={canonicalUrl}
            title={title}
            description={excerpt}
            coverUrl={coverUrl}
          />
        </div>
        <SuggestedPosts posts={suggestedPosts} tagPagePath={tagPagePath} />
        <Comments pageCanonicalUrl={canonicalUrl} pageId={title} />
      </div>
    </Layout>
  )
}

export default Post

export const pageQuery = graphql`
  query($postPath: String!) {
    markdownRemark(frontmatter: { path: { eq: $postPath } }) {
      html
      excerpt
      frontmatter {
        title
        date (formatString: "MMMM DD, YYYY")
        tags
        path
        cover {
          childImageSharp {
            fluid (maxWidth: 700) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
        coverAlt
      }
    }
    site {
      siteMetadata {
        hostname
        pages {
          tag
        }
      }
      pathPrefix
    }
    allMarkdownRemark (
      filter: { frontmatter: { path: { ne: $postPath } } }
    ) {
      edges {
        node {
          frontmatter {
            path
            title
            tags
            date(formatString: "MMMM DD, YYYY")
            cover {
              childImageSharp {
                fluid (maxWidth: 600) {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
          }
          excerpt
        }
      }
    }
  }
`
