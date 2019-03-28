import React, {useState} from 'react'
import {graphql} from 'gatsby'
import Layout from '../components/Layout'
import SearchEngineOptimization from '../components/SearchEngineOptimization'
import Tags from '../components/TagListing';
import {Grid, Col, Row} from 'react-styled-flexboxgrid';
import NodeListing from '../components/NodeListing';
import Card from '../ui/components/Card';
import { Search } from '../components/SearchComponent'

const Index = (props) => {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState('');
    const {
        data,
        location
    } = props;
    
    const {
        title,
        subTitle,
        menuLinks
    } = data.site.siteMetadata;
    
    const docs = data.allMarkdownRemark.edges;
    const tags = data.allMarkdownRemark.group;
    const docsFiltered = filterResults(results, query, docs);
    return (
        <Layout
            location={location}
            title={title}
            subTitle={subTitle}
            menuLinks={menuLinks}>
            <SearchEngineOptimization
                title="All docs"
                keywords={[
                    "docs"
                ]}
            />
            <Search lng="en" setResults={setResults} setQuery={setQuery} />
            <Grid>
                <Row>
                    <Col xs={12} md={8}>
                        <NodeListing nodes={docsFiltered}/>
                    </Col>
                    <Col xs={12} md={4}>
                        <Tags tags={tags}/>
                    </Col>
                </Row>
            </Grid>
        </Layout>
    );
}

export default Index

function filterResults(results, query, docs) {
  if (results && query) {
    const titles = results.map(result => result.title);
    return docs.filter(doc => {
      return titles.includes(doc.node.frontmatter.title)
    });
  } else {
    return docs;
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        subTitle
        menuLinks {
          name
          link
          url
        }
      }
    }
    allMarkdownRemark(
      filter: { fields: { collection: { eq: "docs" } } }
      sort: {
       fields: [frontmatter___date], order: DESC
      }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
      edges {
        node {
          excerpt
          fields {
            slug
            collection
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
