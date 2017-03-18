/** Declaration file generated by dts-gen */

declare namespace JSX {
  type Element = {}
  // interface IntrinsicElements extends etch.dom {}
  interface IntrinsicElements { [elemName: string]: any; }
}

declare module "etch" {
  export function destroy(component: any, removeNode?: boolean): any;
  export function destroySync(component: any, removeNode: any): void;
  export function dom(tag: any, props: any, children: any): any;
  export function getScheduler(): any;
  export function initialize(component: any): void;
  export function render(virtualNode: any, options: any): any;
  export function setScheduler(customScheduler: any): void;
  export function update(component: any, replaceNode?: boolean): any;
  export function updateSync(component: any, replaceNode: any): void;
  export interface dom {
      a(props: any, children: any): any;
      abbr(props: any, children: any): any;
      address(props: any, children: any): any;
      area(props: any, children: any): any;
      article(props: any, children: any): any;
      aside(props: any, children: any): any;
      audio(props: any, children: any): any;
      b(props: any, children: any): any;
      base(props: any, children: any): any;
      bdi(props: any, children: any): any;
      bdo(props: any, children: any): any;
      blockquote(props: any, children: any): any;
      body(props: any, children: any): any;
      br(props: any, children: any): any;
      button(props: any, children: any): any;
      canvas(props: any, children: any): any;
      caption(props: any, children: any): any;
      circle(props: any, children: any): any;
      cite(props: any, children: any): any;
      clipPath(props: any, children: any): any;
      code(props: any, children: any): any;
      col(props: any, children: any): any;
      colgroup(props: any, children: any): any;
      command(props: any, children: any): any;
      datalist(props: any, children: any): any;
      dd(props: any, children: any): any;
      defs(props: any, children: any): any;
      del(props: any, children: any): any;
      details(props: any, children: any): any;
      dfn(props: any, children: any): any;
      dialog(props: any, children: any): any;
      div(props: any, children: any): any;
      dl(props: any, children: any): any;
      dt(props: any, children: any): any;
      ellipse(props: any, children: any): any;
      em(props: any, children: any): any;
      embed(props: any, children: any): any;
      fieldset(props: any, children: any): any;
      figcaption(props: any, children: any): any;
      figure(props: any, children: any): any;
      footer(props: any, children: any): any;
      form(props: any, children: any): any;
      g(props: any, children: any): any;
      h1(props: any, children: any): any;
      h2(props: any, children: any): any;
      h3(props: any, children: any): any;
      h4(props: any, children: any): any;
      h5(props: any, children: any): any;
      h6(props: any, children: any): any;
      head(props: any, children: any): any;
      header(props: any, children: any): any;
      hr(props: any, children: any): any;
      html(props: any, children: any): any;
      i(props: any, children: any): any;
      iframe(props: any, children: any): any;
      image(props: any, children: any): any;
      img(props: any, children: any): any;
      input(props: any, children: any): any;
      ins(props: any, children: any): any;
      kbd(props: any, children: any): any;
      keygen(props: any, children: any): any;
      label(props: any, children: any): any;
      legend(props: any, children: any): any;
      li(props: any, children: any): any;
      line(props: any, children: any): any;
      linearGradient(props: any, children: any): any;
      link(props: any, children: any): any;
      main(props: any, children: any): any;
      map(props: any, children: any): any;
      mark(props: any, children: any): any;
      mask(props: any, children: any): any;
      menu(props: any, children: any): any;
      meta(props: any, children: any): any;
      meter(props: any, children: any): any;
      nav(props: any, children: any): any;
      noscript(props: any, children: any): any;
      object(props: any, children: any): any;
      ol(props: any, children: any): any;
      optgroup(props: any, children: any): any;
      option(props: any, children: any): any;
      output(props: any, children: any): any;
      p(props: any, children: any): any;
      param(props: any, children: any): any;
      path(props: any, children: any): any;
      pattern(props: any, children: any): any;
      polygon(props: any, children: any): any;
      polyline(props: any, children: any): any;
      pre(props: any, children: any): any;
      progress(props: any, children: any): any;
      q(props: any, children: any): any;
      radialGradient(props: any, children: any): any;
      rect(props: any, children: any): any;
      rp(props: any, children: any): any;
      rt(props: any, children: any): any;
      ruby(props: any, children: any): any;
      s(props: any, children: any): any;
      samp(props: any, children: any): any;
      script(props: any, children: any): any;
      section(props: any, children: any): any;
      select(props: any, children: any): any;
      small(props: any, children: any): any;
      source(props: any, children: any): any;
      span(props: any, children: any): any;
      stop(props: any, children: any): any;
      strong(props: any, children: any): any;
      style(props: any, children: any): any;
      sub(props: any, children: any): any;
      summary(props: any, children: any): any;
      sup(props: any, children: any): any;
      svg(props: any, children: any): any;
      table(props: any, children: any): any;
      tbody(props: any, children: any): any;
      td(props: any, children: any): any;
      text(props: any, children: any): any;
      textarea(props: any, children: any): any;
      tfoot(props: any, children: any): any;
      th(props: any, children: any): any;
      thead(props: any, children: any): any;
      time(props: any, children: any): any;
      title(props: any, children: any): any;
      tr(props: any, children: any): any;
      track(props: any, children: any): any;
      tspan(props: any, children: any): any;
      u(props: any, children: any): any;
      ul(props: any, children: any): any;
      video(props: any, children: any): any;
      wbr(props: any, children: any): any;
  }
}
