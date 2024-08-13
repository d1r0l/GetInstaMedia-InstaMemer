import { shuffle } from 'lodash';
import { Repository } from 'instagram-private-api/dist/core/repository';
import Bluebird from 'bluebird';

export class SimulateServiceAddon extends Repository {
  private get postLoginFlowRequests(): Array<() => unknown> {
    return [
      () => this.client.zr.tokenResult(),
      () => this.client.launcher.postLoginSync(),
      () => this.client.attribution.logAttribution(),
      () => this.client.attribution.logResurrectAttribution(),
      () => this.client.loom.fetchConfig(),
      () => this.client.linkedAccount.getLinkageStatus(),
      () =>
        this.client.feed
          .timeline()
          .request({ recoveredFromCrash: '1', reason: 'cold_start_fetch' }),
      () => this.client.fbsearch.recentSearches(),
      () => this.client.direct.rankedRecipients('reshare'),
      () => this.client.direct.rankedRecipients('raven'),
      () => this.client.direct.getPresence(),
      () => this.client.feed.directInbox().request(),
      () => this.client.media.blocked(),
      () => this.client.qp.batchFetch(),
      () => this.client.qp.getCooldowns(),
      () => this.client.user.arlinkDownloadInfo(),
      () => this.client.discover.topicalExplore(),
      () => this.client.discover.markSuSeen(),
      () => this.facebookOta(),
      () => this.client.status.getViewableStatuses(),
    ];
  }

  private static async executeRequestsFlow({
    requests,
    concurrency = 1,
    toShuffle = true,
  }: {
    requests: Array<() => unknown>;
    concurrency?: number;
    toShuffle?: boolean;
  }) {
    if (toShuffle) {
      requests = shuffle(requests);
    }
    await Bluebird.map(requests, (request) => request(), { concurrency });
  }

  public async postLoginFlow(concurrency?: number, toShuffle?: boolean) {
    return SimulateServiceAddon.executeRequestsFlow({
      requests: this.postLoginFlowRequests,
      concurrency,
      toShuffle,
    });
  }

  private async facebookOta() {
    const uid = this.client.state.cookieUserId;
    const res = await this.client.request.send({
      url: '/api/v1/facebook_ota/',
      qs: {
        fields: this.client.state.fbOtaFields,
        custom_user_id: uid,
        signed_body: this.client.request.signature('') + '.',
        ig_sig_key_version: this.client.state.signatureVersion,
        version_code: this.client.state.appVersionCode,
        version_name: this.client.state.appVersion,
        custom_app_id: this.client.state.fbOrcaApplicationId,
        custom_device_id: this.client.state.uuid,
      },
    });
    return res.body as unknown;
  }
}
