<template>
<modal-layout
  :show-controls="false"
  :content-styles="{ padding: 0 }"
  title="Add Source">

  <div slot="content"
    class="add-source">
    <!-- Standard sources -->
    <add-source-info
      v-if="inspectedSource === 'image_source'"
      @clickAdd="selectSource('image_source')"
      name="Image"
      description="Add images to your scene.">
      <img slot="media" src="../../../media/source-demos/source-image.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>png</li>
        <li>jpg</li>
        <li>jpeg</li>
        <li>gif</li>
        <li>tga</li>
        <li>bmp</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'slideshow'"
      @clickAdd="selectSource('slideshow')"
      name="Image Slide Show"
      description="Add a slideshow of images to your scene.">
      <img slot="media" src="../../../media/source-demos/source-slide-show.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>png</li>
        <li>jpg</li>
        <li>jpeg</li>
        <li>gif</li>
        <li>tga</li>
        <li>bmp</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'ffmpeg_source'"
      @clickAdd="selectSource('ffmpeg_source')"
      name="Media Source"
      description="Add videos or sound clips to your scene.">
      <img slot="media" src="../../../media/source-demos/source-media.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>mp4</li>
        <li>ts</li>
        <li>mov</li>
        <li>flv</li>
        <li>mkv</li>
        <li>avi</li>
        <li>mp3</li>
        <li>ogg</li>
        <li>aac</li>
        <li>wav</li>
        <li>gif</li>
        <li>webm</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'window_capture'"
      @clickAdd="selectSource('window_capture')"
      name="Window Capture"
      description="Capture a specific window that's open on your computer.">
      <img slot="media" src="../../../media/source-demos/source-capture.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Compatible with most modern browsers and programs</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'dshow_input'"
      @clickAdd="selectSource('dshow_input')"
      name="Video Capture Device"
      description="Select from your build in USB webcam or an external.">
      <img slot="media" src="../../../media/source-demos/source-video.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Built in webcam</li>
        <li>Logitech webcam</li>
        <li>Capture cards (Elgato, Avermedia, BlackMagic)</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'wasapi_output_capture'"
      @clickAdd="selectSource('wasapi_output_capture')"
      name="Audio Output Capture"
      description="Captures your desktop audio for the purpose of playing sound, such as music or speech.">
      <img slot="media" src="../../../media/source-demos/source-output.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Desktop audio</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'color_source'"
      @clickAdd="selectSource('color_source')"
      name="Color Source"
      description="Add a color to the background of your whole scene or just a part.">
      <img slot="media" src="../../../media/source-demos/source-color.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Hex</li>
        <li>RGBA</li>
        <li>HSV</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'browser_source'"
      @clickAdd="selectSource('browser_source')"
      name="BrowserSource"
      description="Allows you to add web-based content as a source, such as web pages and Flash SWFs.">
      <img slot="media" src="../../../media/source-demos/source-browser.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Websites</li>
        <li>Third party widgets</li>
        <li>HTML</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'text_gdiplus'"
      @clickAdd="selectSource('text_gdiplus')"
      name="Text (GDI+)"
      description="Add text to your scene and adjust its style.">
      <img slot="media" src="../../../media/source-demos/source-text.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Hex</li>
        <li>RGBA</li>
        <li>HSV</li>
        <li>System Fonts</li>
        <li>System Sizes</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'monitor_capture'"
      @clickAdd="selectSource('monitor_capture')"
      name="Display Capture"
      description="Capture your entire computer monitor.">
      <img slot="media" src="../../../media/source-demos/source-capture-full.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Primary monitor</li>
        <li>Secondary monitor</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'game_capture'"
      @clickAdd="selectSource('game_capture')"
      name="Game Capture"
      description="Capture a game you're playing on your computer.">
      <img slot="media" src="../../../media/source-demos/source-game-capture.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Built in works with most modern computer games</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'wasapi_input_capture'"
      @clickAdd="selectSource('wasapi_input_capture')"
      name="Audio Input Capture"
      description="Any device that attaches to a computer for the purpose of capturing sound, such as music or speech.">
      <img slot="media" src="../../../media/source-demos/source-input.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Built in microphones</li>
        <li>USB microphones</li>
        <li>Other USB devices</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'decklink-input'"
      @clickAdd="selectSource('decklink-input')"
      name="Blackmagic Device"
      description="Capture the feed your decklink device is capturing.">
      <img slot="media" src="../../../media/source-demos/source-game-capture.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Works with most of the recent Blackmagic cards.</li>
      </ul>
    </add-source-info>

    <!-- Widget Sources -->
    <add-source-info
      v-if="inspectedSource === widgetTypes.AlertBox"
      @clickAdd="selectWidget(widgetTypes.AlertBox)"
      name="Alertbox"
      description="Thanks viewers with notification popups.">
      <img slot="media" src="../../../media/source-demos/alertbox.gif"/>
      <ul slot="support-list" class="source-support__list">
        <li>Donations</li>
        <li>Subscriptions</li>
        <li>Follows</li>
        <li>Bits</li>
        <li>Hosts</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.DonationTicker"
      @clickAdd="selectWidget(widgetTypes.DonationTicker)"
      name="Donation Ticker"
      description="Show off your most recent donations to your viewers.">
      <img slot="media" src="../../../media/source-demos/donationticker.gif"/>
      <ul slot="support-list" class="source-support__list">
        <li>Donations</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.EventList"
      @clickAdd="selectWidget(widgetTypes.EventList)"
      name="Event List"
      description="Include your channel's most recent events into your stream.">
      <img slot="media" src="../../../media/source-demos/eventlist.gif"/>
      <ul slot="support-list" class="source-support__list">
        <li>Donations</li>
        <li>Subscriptions</li>
        <li>Follows</li>
        <li>Bits</li>
        <li>Hosts</li>
        <li>Redemptions</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.DonationGoal"
      @clickAdd="selectWidget(widgetTypes.DonationGoal)"
      name="Donation Goal"
      description="Set a goal for your viewers to help you reach.">
      <img slot="media" src="../../../media/source-demos/donationgoal.gif"/>
      <ul slot="support-list" class="source-support__list">
        <li>Donations</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.FollowerGoal"
      @clickAdd="selectWidget(widgetTypes.FollowerGoal)"
      name="Follower Goal"
      description="Set a goal for your viewers to help you reach.">
      <img slot="media" src="../../../media/source-demos/followergoal.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Twitch Follows</li>
        <li>Youtube Follows</li>
        <li>Mixer Follows</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.BitGoal"
      @clickAdd="selectWidget(widgetTypes.BitGoal)"
      name="Bit Goal"
      description="Set a goal for your viewers to help you reach.">
      <img slot="media" src="../../../media/source-demos/followergoal.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Twitch Bits</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.SubscriptionGoal"
      @clickAdd="selectWidget(widgetTypes.SubscriptionGoal)"
      name="Subscription Goal"
      description="Set a goal for your viewers to help you reach.">
      <img slot="media" src="../../../media/source-demos/followergoal.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Youtube Subscribers</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.ChatBox"
      @clickAdd="selectWidget(widgetTypes.ChatBox)"
      name="Chatbox"
      description="Include your channel's chat into your stream.">
      <img slot="media" src="../../../media/source-demos/chat.gif"/>
      <ul slot="support-list" class="source-support__list">
        <li>Twitch chat</li>
        <li>Youtube chat</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.TheJar"
      @clickAdd="selectWidget(widgetTypes.TheJar)"
      name="The Jar"
      description="The jar that catches bits, tips, and more.">
      <img slot="media" src="../../../media/source-demos/jar.gif"/>
      <ul slot="support-list" class="source-support__list">
        <li>Donations</li>
        <li>Subscriptions</li>
        <li>Follows</li>
        <li>Bits</li>
        <li>Hosts</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.ViewerCount"
      @clickAdd="selectWidget(widgetTypes.ViewerCount)"
      name="Viewer Count"
      description="Show off your viewers from multiple platforms.">
      <img slot="media" src="../../../media/source-demos/viewercount-source.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Youtube</li>
        <li>Twitch</li>
        <li>Mixer</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.StreamBoss"
      @clickAdd="selectWidget(widgetTypes.StreamBoss)"
      name="Stream Boss"
      description="Battle with bits to be the boss of the stream!">
      <img slot="media" src="../../../media/source-demos/streamboss-source.png"/>
      <ul slot="support-list" class="source-support__list">
        <li>Twitch Bits</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === widgetTypes.Credits"
      @clickAdd="selectWidget(widgetTypes.Credits)"
      name="Credits"
      description="Rolling credits to play at the end of your stream.">
      <img slot="media" src="../../../media/source-demos/credits.gif"/>
      <ul slot="support-list" class="source-support__list">
        <li>New Followers</li>
        <li>New Subscribers</li>
        <li>Cheers</li>
        <li>Donations</li>
      </ul>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'scene'"
      @clickAdd="selectSource('scene')"
      name="Scene"
      description="Allows you to add existing scene as a source">
      <img slot="media" src="../../../media/source-demos/source-browser.png"/>
    </add-source-info>

    <add-source-info
      v-if="inspectedSource === 'streamlabel'"
      @clickAdd="selectWidget(widgetTypes.Credits)"
      name="Stream Label"
      description="This is a placeholder description for streamlabels.">
      <img slot="media" src="../../../media/source-demos/credits.gif"/>
      <ul slot="support-list" class="source-support__list">
        <li>New Followers</li>
        <li>New Subscribers</li>
        <li>Cheers</li>
        <li>Donations</li>
      </ul>
    </add-source-info>

    <div
      class="source-info"
      v-if="inspectedSource === null">
      <div class="source-welcome">
        <div class="source-welcome__text">
          <h3>Welcome to sources!</h3>
          <ol>
            <li>Browse through our Standard and Widget sources</li>
            <li>Click a source to get more details about it</li>
            <li>Click 'Add Source' when you're ready to add it to your scene</li>
          </ol>
        </div>
        <div class="source-welcome__img">
          <img slot="media" src="../../../media/source-demos/source-welcome.png"/>
        </div>
      </div>
    </div>

    <div class="sources">
      <div class="source-group">
        <h4>Standard</h4>
        <ul class="source-list">
          <li
            v-for="source in availableSources"
            class="source source--standard"
            :class="{'source--active': inspectedSource === source.value}"
            @click="inspectSource(source.value)"
            @dblclick="selectSource(source.value)">
            {{ source.description }}
          </li>
        </ul>
      </div>

      <div class="source-group" v-if="loggedIn">
        <h4>Widgets</h4>
        <div class="source-list">
          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.Alertbox}"
            @click="inspectSource(widgetTypes.AlertBox)"
            @dblclick="selectWidget(widgetTypes.AlertBox)">
            <div>Alertbox</div><span class="label--essential">Essential</span>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.EventList}"
            @click="inspectSource(widgetTypes.EventList)"
            @dblclick="selectWidget(widgetTypes.EventList)">
            <div>Event List</div><span class="label--essential">Essential</span>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.TheJar}"
            @click="inspectSource(widgetTypes.TheJar)"
            @dblclick="selectWidget(widgetTypes.TheJar)">
            <div>The Jar</div><span class="label--essential">Essential</span>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.DonationGoal}"
            @click="inspectSource(widgetTypes.DonationGoal)"
            @dblclick="selectWidget(widgetTypes.DonationGoal)">
            <div>Donation Goal</div>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.FollowerGoal}"
            @click="inspectSource(widgetTypes.FollowerGoal)"
            @dblclick="selectWidget(widgetTypes.FollowerGoal)">
            <div>Follower Goal</div>
          </div>

          <div
            class="source source--widget"
            v-show="platform === 'twitch'"
            :class="{'source--active': inspectedSource === widgetTypes.BitGoal}"
            @click="inspectSource(widgetTypes.BitGoal)"
            @dblclick="selectWidget(widgetTypes.BitGoal)">
            <div>Bit Goal</div>
          </div>

          <div
            class="source source--widget"
            v-show="platform === 'youtube'"
            :class="{'source--active': inspectedSource === widgetTypes.SubscriptionGoal}"
            @click="inspectSource(widgetTypes.SubscriptionGoal)"
            @dblclick="selectWidget(widgetTypes.SubscriptionGoal)">
            <div>Subscription Goal</div>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.DonationTicker}"
            @click="inspectSource(widgetTypes.DonationTicker)"
            @dblclick="selectWidget(widgetTypes.DonationTicker)">
            <div>Donation Ticker</div>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.ChatBox}"
            @click="inspectSource(widgetTypes.ChatBox)"
            @dblclick="selectWidget(widgetTypes.ChatBox)">
            <div>Chatbox</div>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.StreamBoss}"
            @click="inspectSource(widgetTypes.StreamBoss)"
            @dblclick="selectWidget(widgetTypes.StreamBoss)">
            <div>Stream Boss</div>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.Credits}"
            @click="inspectSource(widgetTypes.Credits)"
            @dblclick="selectWidget(widgetTypes.Credits)">
            <div>Credits</div>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === widgetTypes.ViewerCount}"
            @click="inspectSource(widgetTypes.ViewerCount)"
            @dblclick="selectWidget(widgetTypes.ViewerCount)">
            <div>Viewer Count</div>
          </div>

          <div
            class="source source--widget"
            :class="{'source--active': inspectedSource === 'streamlabel'}"
            @click="inspectSource('streamlabel')"
            @dblclick="selectSource('text_gdiplus', 'streamlabels')">
            <div>Stream Label</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-layout-controls">
      <button
        @click="selectInspectedSource()"
        class="button button--action"
        :disabled="inspectedSource === null">
          Add Source
      </button>
    </div>
  </div>
</modal-layout>
</template>

<script lang="ts" src="./SourcesShowcase.vue.ts"></script>

<style lang="less">
@import "../../styles/index";

.source-info {
  padding: 20px;
  border-bottom: 1px solid @day-border;
  display: flex;
  flex-direction: row;
  flex: 0 0 190px;
  height: 190px;
  align-items: center;
}

.night-theme {
  .source-info {
    border-color: @night-border;
    background-color: @night-primary;
  }
}
</style>

<style lang="less" scoped>
@import "../../styles/index";

h4 {
  color: @grey;
}

.add-source {
  color: @navy;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.source-welcome {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.source-welcome__img {
  padding: 0 20px 0 40px;
  flex: 0 0 50%;
}

.sources {
  padding: 20px;
  display: flex;
  flex: 1 0 auto;

  .source-group {
    &:last-child {
      padding: 20px 0 20px 20px;
      border-right: none;
    }
  }
}

.source-group {
  border-right: 1px solid @day-border;
  margin: -20px 0px -20px 0px;
  padding: 20px 20px 20px 0;
  flex: 0 0 50%;
}

.source-list {
  list-style-type: none;
  margin: 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .source {
    &:nth-child(1),
    &:nth-child(2) {
      margin-top: 0;
    }
  }
}

.source {
  color: @navy;
  cursor: pointer;
  .transition;
  border: 1px solid @day-border;
  padding: 4px 10px;
  margin-top: 10px;
  width: 49%;

  &:hover,
  &.source--active {
    color: @navy-secondary;
    .semibold;
    border-color: @day-border;
    background-color: @day-secondary;
  }
}

.source--standard {
  display: inline-block;
}

.source--widget {
  display: flex;
  align-items: center;
  .radius;
  .transition;
}

.source__icon {
  margin-right: 10px;
  width: 30px;
}

.night-theme {
  .add-source {
    color: @grey;
  }

  .source {
    color: @grey;
    background: @night-hover;
    border-color: @night-hover;

    &:hover,
    &.source--active {
      color: @white;
      border-color: @night-secondary;
      background: @night-secondary;
    }
  }

  .source-group {
    border-color: @night-border;
  }
}
</style>