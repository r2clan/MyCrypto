import React, { useContext } from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/theme';
import {
  NotificationsContext,
  notificationsConfigs,
  NotificationTemplates
} from 'v2/providers/NotificationsProvider';
import { ExtendedAccount } from 'v2/types';

// Legacy
import closeIcon from 'common/assets/images/icn-close.svg';

const { SCREEN_MD } = BREAK_POINTS;

const MainPanel = styled(Panel)`
  position: relative;
  margin-left: 15px;
  margin-right: 15px;
  padding-left: 25px;
  padding-right: 25px;

  @media (min-width: ${SCREEN_MD}) {
    margin: 0 0 50px 0;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  right: 17px;
  top: 6px;
  img {
    width: 13px;
    height: 13px;
  }
`;

interface Props {
  accounts: ExtendedAccount[];
}

const NotificationsPanel = ({ accounts }: Props) => {
  const {
    notifications,
    displayNotification,
    currentNotification,
    dismissCurrentNotification
  } = useContext(NotificationsContext);

  const handleCloseClick = () => {
    if (!currentNotification) {
      return;
    }

    switch (currentNotification.template) {
      case NotificationTemplates.onboardingResponsible: {
        /*  Trigger "please understand" notification after "onboarding responsible" notification.
            "previousNotificationClosedDate" is later used to show the "please understand" notification
             with a delay after the current one has been dismissed.
        */
        dismissCurrentNotification();
        displayNotification(NotificationTemplates.onboardingPleaseUnderstand, {
          previousNotificationClosedDate: new Date()
        });
        break;
      }
      default: {
        dismissCurrentNotification();
        break;
      }
    }
  };

  if (
    !notifications.find(x => x.template === NotificationTemplates.onboardingResponsible) &&
    accounts.length > 0
  ) {
    displayNotification(NotificationTemplates.onboardingResponsible, {
      firstDashboardVisitDate: new Date()
    });
  }

  const getNotificationBody = () => {
    const template = currentNotification!.template;
    const templateData = currentNotification!.templateData;
    const NotificationComponent = notificationsConfigs[template].layout;
    return <NotificationComponent {...templateData} />;
  };

  return (
    <React.Fragment>
      {currentNotification && (
        <MainPanel>
          <CloseButton basic={true} onClick={handleCloseClick}>
            <img src={closeIcon} alt="Close" />
          </CloseButton>
          {getNotificationBody()}
        </MainPanel>
      )}
    </React.Fragment>
  );
};

export default NotificationsPanel;