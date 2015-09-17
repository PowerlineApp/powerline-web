describe('Youtube service', function () {

  beforeEach(module('app'));

  it('should parse video id from url', inject(function (youtube) {
    expect(youtube.parseId('http://www.youtube.com/watch?v=ON2XWvyePH8')).toEqual('ON2XWvyePH8');
    expect(youtube.parseId('http://www.youtube.com/watch?v=ON2XWvyePH8&')).toEqual('ON2XWvyePH8');
    expect(youtube.parseId('http://www.youtube.com/watch?v=ON2XWvyePH8 ')).toEqual('ON2XWvyePH8');
    expect(youtube.parseId('http://www.youtube.com/watch?t=test&v=ON2XWvyePH8')).toEqual('ON2XWvyePH8');
  }));

  it('should return null when video id not found', inject(function (youtube) {
    expect(youtube.parseId('http://www.youtube.com/watch?k=')).toBeNull();
  }));

  it('should generate default preview link', inject(function (youtube) {
    expect(youtube.generatePreviewLink('test')).toEqual('http://img.youtube.com/vi/test/0.jpg');
  }));

  it('should generate preview link with preview image id', inject(function (youtube) {
    expect(youtube.generatePreviewLink('test', 3)).toEqual('http://img.youtube.com/vi/test/3.jpg');
  }));

  it('shouldn\'t generate preview link when id is not defined', inject(function (youtube) {
    expect(youtube.generatePreviewLink()).toBeNull();
  }));

});
