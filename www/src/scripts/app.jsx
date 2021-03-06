import 'babel/polyfill'
import React from 'react'
import Router, { Route, DefaultRoute, NotFoundRoute, Link, RouteHandler, HistoryLocation } from 'react-router'
import DocumentTitle from 'react-document-title'
import injectTapEventPlugin from 'react-tap-event-plugin'
import mui, { AppBar, Tab, Tabs, Styles, Paper } from 'material-ui'

import IndexView from './components/index-view'
import ScoreboardView from './components/scoreboard-view'
import NewsView from './components/news-view'
import LogsView from './components/logs-view'
import NotFoundView from './components/not-found-view'
import ContestInfoBarView from './components/contest-info-bar-view'

import dataManager from './data-manager'
import eventManager from './event-manager'

import Customize from '../../customize'


let ThemeManager = new mui.Styles.ThemeManager()

class App extends React.Component {
    constructor() {
        super()
        this.onTabActivate = this.onTabActivate.bind(this)
        this.onNavigateMain = this.onNavigateMain.bind(this)
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.func
        }
    }

    static get childContextTypes() {
        return {
            muiTheme: React.PropTypes.object
        }
    }

    componentWillMount() {
        ThemeManager.setPalette({
            primary1Color: Customize.primary1Color,
            accent1Color: Customize.accent1Color
        })
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        }
    }

    onTabActivate(activeTab) {
        this.context.router.transitionTo(activeTab.props.route)
    }

    onNavigateMain() {
        this.context.router.transitionTo('index')
    }

    render() {
        let selectedTab = 'notfound'
        let routeNames = ['index', 'scoreboard', 'news']
        if (this.props.identity.isInternal()) {
            routeNames.push('logs')
        }

        for (let routeName of routeNames) {
            if (this.context.router.isActive(routeName, '', '')) {
                selectedTab = routeName
                break
            }
        }

        let rootStyles = {
            backgroundColor: Customize.primary1Color,
            color: Customize.headerColor,
            position: 'fixed',
            top: 0,
            height: 64,
            zIndex: 4,
            width: '100%'
        }

        let containerStyles = {
            position: 'absolute',
            right: Styles.Spacing.desktopGutter,
            bottom: 0
        }

        let tabsStyles = {
            width: 425,
            bottom: 0
        }

        let tabStyle = {
            height: 64,
            textTransform: 'uppercase'
        }

        let headerContainerStyle = {
            position: 'absolute',
            width: 300,
            left: Styles.Spacing.desktopGutter
        }

        let spanStyle = {
            color: Customize.headerColor,
            fontWeight: Styles.Typography.fontWeightLight,
            top: 22,
            position: 'absolute',
            fontSize: 26,
            cursor: 'pointer'
        }

        let tabs = [
            <Tab style={tabStyle} key="scoreboard" label="Scoreboard" route="scoreboard" value="scoreboard" onActive={this.onTabActivate}/>,
            <Tab style={tabStyle} key="news" label="News" route="news" value="news" onActive={this.onTabActivate}/>
        ]

        if (this.props.identity.isInternal()) {
            tabs.push(<Tab style={tabStyle} key="logs" label="Logs" route="logs" value="logs" onActive={this.onTabActivate}/>)
        }

        let footerStyle = {
            backgroundColor: Styles.Colors.grey800,
            color: Styles.Colors.grey400,
            position: 'absolute',
            bottom: 0,
            height: '80px',
            width: '100%',
            textAlign: 'center',
            fontSize: '0.9em'
        }

        let linkStyle = {
            color: Styles.Colors.grey200,
            textDecoration: 'none'
        }

        let title = Customize.contestTitle

        return (
            <DocumentTitle title={title}>
                <section>
                    <Paper zDepth={0} rounded={false} style={rootStyles}>
                        <div style={headerContainerStyle}>
                            <a style={spanStyle} onTouchTap={this.onNavigateMain}>{title}</a>
                        </div>
                        <div style={containerStyles}>
                            <Tabs value={selectedTab} style={tabsStyles}>
                                {tabs}
                            </Tabs>
                        </div>
                    </Paper>

                    <ContestInfoBarView/>
                    <main>
                        <RouteHandler identity={this.props.identity}/>
                    </main>

                    <Paper zDepth={0} rounded={false} style={footerStyle}>
                        <p>&copy; 2015 <a href="https://github.com/aspyatkin" target="_blank" style={linkStyle}>Alexander Pyatkin</a>. Crafted with passion in Samara, Russia.</p>
                        <p>Find this on <a href="https://github.com/aspyatkin/themis-finals" target="_blank" style={linkStyle}>GitHub</a></p>
                    </Paper>
                </section>
            </DocumentTitle>
        )
    }
}


function ready(callback) {
    if (document.readyState != 'loading') {
        callback()
    } else {
        document.addEventListener('DOMContentLoaded', callback)
    }
}


function getRoutes(identity) {
    return (
        <Route handler={App}>
            <DefaultRoute name="index" handler={IndexView}/>
            <NotFoundRoute handler={NotFoundView}/>

            <Route name="scoreboard" handler={ScoreboardView}/>
            <Route name="news" handler={NewsView}/>
            <Route name="logs" handler={identity.isInternal() ? LogsView : NotFoundView}/>
        </Route>
    )
}


function render(identity) {
    Router.run(getRoutes(identity), HistoryLocation, (Root) => {
        React.render(<Root identity={identity}/>, document.getElementById('app'))
    })
}

ready(() => {
    dataManager
    .getIdentity()
    .then((identity) => {
        injectTapEventPlugin()
        render(identity)
    })
    .catch((err) => {
        console.log('Error', err)
    })
})
