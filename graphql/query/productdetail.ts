import gql from 'graphql-tag'

//获取竞拍期的竞拍历史
export const GET_FIRST = gql`
    query ProductIssue ($issue: Int!){
        product_issue(
            issue:$issue
        ) {
            id
    }
`
