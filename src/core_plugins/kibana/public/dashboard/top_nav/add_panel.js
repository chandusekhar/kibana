/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { toastNotifications } from 'ui/notify';
import { SavedObjectFinder } from 'ui/saved_objects/components/saved_object_finder';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiButton,
  EuiTabs,
  EuiTab,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';

const VIS_TAB_ID = 'vis';
const SAVED_SEARCH_TAB_ID = 'search';

export class DashboardAddPanel extends React.Component {
  constructor(props) {
    super(props);

    const addNewVisBtn = (
      <EuiButton
        onClick={this.props.addNewVis}
        data-test-subj="addNewSavedObjectLink"
      >
        Add new Visualization
      </EuiButton>
    );

    const tabs = [{
      id: VIS_TAB_ID,
      name: 'Visualization',
      dataTestSubj: 'addVisualizationTab',
      toastDataTestSubj: 'addVisualizationToDashboardSuccess',
      savedObjectFinder: (
        <SavedObjectFinder
          key="visSavedObjectFinder"
          callToActionButton={addNewVisBtn}
          onChoose={this.onAddPanel}
          find={this.props.find}
          noItemsMessage="No matching visualizations found."
          savedObjectType="visualization"
        />
      )
    }, {
      id: SAVED_SEARCH_TAB_ID,
      name: 'Saved Search',
      dataTestSubj: 'addSavedSearchTab',
      toastDataTestSubj: 'addSavedSearchToDashboardSuccess',
      savedObjectFinder: (
        <SavedObjectFinder
          key="searchSavedObjectFinder"
          onChoose={this.onAddPanel}
          find={this.props.find}
          noItemsMessage="No matching saved searches found."
          savedObjectType="search"
        />
      )
    }];

    this.state = {
      tabs: tabs,
      selectedTab: tabs[0],
    };
  }

  onSelectedTabChanged = tab => {
    this.setState({
      selectedTab: tab,
    });
  }

  renderTabs() {
    return this.state.tabs.map((tab) => {
      return (
        <EuiTab
          onClick={() => this.onSelectedTabChanged(tab)}
          isSelected={tab.id === this.state.selectedTab.id}
          key={tab.id}
          data-test-subj={tab.dataTestSubj}
        >
          {tab.name}
        </EuiTab>
      );
    });
  }

  onAddPanel = (id, type) => {
    this.props.addNewPanel(id, type);

    // To avoid the clutter of having toast messages cover flyout
    // close previous toast message before creating a new one
    if (this.lastToast) {
      toastNotifications.remove(this.lastToast);
    }

    this.lastToast = toastNotifications.addSuccess({
      title: `${this.state.selectedTab.name} was added to your dashboard`,
      'data-test-subj': this.state.selectedTab.toastDataTestSubj,
    });
  }

  render() {
    return (
      <EuiFlyout
        ownFocus
        onClose={this.props.onClose}
        size="s"
        data-test-subj="dashboardAddPanel"
      >
        <EuiFlyoutBody>

          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiTitle>
                <h2>Add Panels</h2>
              </EuiTitle>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiTabs>
            {this.renderTabs()}
          </EuiTabs>

          <EuiSpacer size="s" />

          {this.state.selectedTab.savedObjectFinder}

        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }
}

DashboardAddPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  find: PropTypes.func.isRequired,
  addNewPanel: PropTypes.func.isRequired,
  addNewVis: PropTypes.func.isRequired,
};
