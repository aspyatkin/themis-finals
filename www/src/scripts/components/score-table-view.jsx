import React from 'react'

import ScoreTableHeaderView from './score-table-header-view'
import ScoreTableRowView from './score-table-row-view'


export default class ScoreTableView extends React.Component {
    render() {
        let rows = this.props.scoreboard.rows.map((row, ndx) => {
            return (
                <ScoreTableRowView key={row.id} identity={this.props.identity} order={this.props.scoreboard.order} data={row} live={this.props.scoreboard.live}/>
            )
        })

        return (
            <table className="themis-table">
                <thead>
                    <ScoreTableHeaderView order={this.props.scoreboard.order} headers={this.props.scoreboard.headers}/>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
}
