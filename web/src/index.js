import "./global/config"
import React from "react"
import ReactDOM from "react-dom"
import reportWebVitals from "./reportWebVitals"
import {Switch, Route} from "react-router-dom"

import {Providers} from "./global/providers.comp"

import {Page as Root} from "./pages/root.page"
import {Page as Diaper} from "./pages/diaper.page"
import {Page as Account} from "./pages/account"
import {Page as NotFound} from "./pages/not-found.page"

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import "./font.css"

window.fcl = fcl
window.t = t

ReactDOM.render(
  <Providers>
    <Switch>
      <Route exact path="/0x:address" component={Account} />
      <Route exact path="/diaper" component={Diaper} />
      <Route exact path="/" component={Root} />
      <Route component={NotFound} />
    </Switch>
  </Providers>,
  document.getElementById("root")
)

reportWebVitals()
