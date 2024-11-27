class LikBuilder {
  constructor(id = null, helperId = 1) {
    this.link = {
      id: id ?? 1,
      title: `Link ${id ?? 1}`,
      url: "/url",
      order: 1,
      target: true,
      helperId,
    };
  }
  static link(id = null, helperId = 1) {
    return new LikBuilder(id);
  }

  missingTitle() {
    this.link.title = "";
    return this;
  }

  invalidTitle() {
    this.link.title = "http://url.com";
    return this;
  }

  missingUrl() {
    this.link.url = "";
    return this;
  }

  invalidUrl() {
    this.link.url = "url";
    return this;
  }

  invalidOrderType() {
    this.link.order = "order";
    return this;
  }

  invalidOrderValue() {
    this.link.order = -1;
    return this;
  }

  missingOrder() {
    delete this.link.order;
    return this;
  }

  missingTarget() {
    delete this.link.target;
    return this;
  }

  withoutId() {
    delete this.link.id;
    return this;
  }

  build() {
    return this.link;
  }
}

class HelperLinkBuilder {
  constructor(id = null) {
    this.helperLink = {
      id: id ?? 1,
      title: `Helper Link ${id ?? 1}`,
      headerBackgroundColor: "#F8F9F8",
      linkFontColor: "#344054",
      iconColor: "#7F56D9",
      createdBy: 1,
      links: Array.from({ length: 5 }, (_, i) =>
        LikBuilder.link(i + 1, id).build()
      ),
    };
  }

  static helperLink(id = null) {
    return new HelperLinkBuilder(id);
  }

  missingTitle() {
    this.helperLink.title = "";
    return this;
  }

  invalidHeaderBackgroundColor() {
    this.helperLink.headerBackgroundColor = "color";
    return this;
  }

  invalidLinkFontColor() {
    this.helperLink.linkFontColor = "color";
    return this;
  }

  invalidIconColor() {
    this.helperLink.iconColor = "color";
    return this;
  }

  withoutId() {
    delete this.helperLink.id;
    return this;
  }

  build() {
    return this.helperLink;
  }
}

const LinksList = Array.from({ length: 5 }, (_, i) =>
  LikBuilder.link(i + 1).build()
);

const HelperLinkList = Array.from({ length: 10 }, (_, i) =>
  HelperLinkBuilder.helperLink(i + 1).build()
).map((link, i) => {
  if (i < 5) link.createdBy = 1;
  else link.createdBy = 2;
  return link;
});

module.exports = {
  HelperLinkBuilder,
  HelperLinkList,
  LikBuilder,
  LinksList,
};