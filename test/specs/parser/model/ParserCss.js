var path = 'Parser/';
define([path + 'model/ParserCss',],
  function(ParserCss) {

    return {
      run : function(){

        describe('ParserCss', function() {
          var obj;

          beforeEach(function () {
            obj = new ParserCss();
          });

          afterEach(function () {
            delete obj;
          });

          it('Parse selector', function() {
            var str = '.test';
            var result = [['test']];
            obj.parseSelector(str).result.should.deep.equal(result);
          });

          it('Parse selectors', function() {
            var str = '.test1, .test1.test2, .test2.test3';
            var result = [['test1'], ['test1', 'test2'], ['test2', 'test3']];
            obj.parseSelector(str).result.should.deep.equal(result);
          });

          it('Ignore not valid selectors', function() {
            var str = '.test1.test2, .test2 .test3, div > .test4, #test.test5, .test6';
            var result = [['test1', 'test2'], ['test6']];
            obj.parseSelector(str).result.should.deep.equal(result);
          });

          it('Parse selectors with state', function() {
            var str = '.test1. test2, .test2>test3, .test4.test5:hover';
            var result = [['test4', 'test5:hover']];
            obj.parseSelector(str).result.should.deep.equal(result);
          });

          it('Parse simple rule', function() {
            var str = ' .test1 {color:red; width: 50px  }';
            var result = {
              selectors: ['test1'],
              style: {
                color: 'red',
                width: '50px',
              }
            };
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse rule with more selectors', function() {
            var str = ' .test1.test2 {color:red; test: value}';
            var result = {
              selectors: ['test1', 'test2'],
              style: { color: 'red'}
            };
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse same rule with more selectors', function() {
            var str = ' .test1.test2, .test3{ color:red }';
            var result = [{
              selectors: ['test1', 'test2'],
              style: { color: 'red'}
            },{
              selectors: ['test3'],
              style: { color: 'red'}
            }];
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse more rules', function() {
            var str = ' .test1.test2, .test3{ color:red } .test4, .test5.test6{ width:10px }';
            var result = [{
              selectors: ['test1', 'test2'],
              style: { color: 'red'}
            },{
              selectors: ['test3'],
              style: { color: 'red'}
            },{
              selectors: ['test4'],
              style: { width: '10px'}
            },{
              selectors: ['test5', 'test6'],
              style: { width: '10px'}
            }];
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse rule with state', function() {
            var str = ' .test1.test2:hover{ color:red }';
            var result = {
              selectors: ['test1', 'test2'],
              style: { color: 'red'},
              state: 'hover'
            };
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse rule with state like after', function() {
            var str = ' .test1.test2::after{ color:red }';
            var result = {
              selectors: ['test1', 'test2'],
              style: { color: 'red'},
              state: ':after'
            };
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse rule with nth-x state', function() {
            var str = ' .test1.test2:nth-of-type(2n){ color:red }';
            var result = {
              selectors: ['test1', 'test2'],
              style: { color: 'red'},
              state: 'nth-of-type(2n)'
            };
            obj.parse(str).should.deep.equal(result);
          });

          // Phantom don't find 'node.conditionText' so will skip it
          it('Parse rule inside media query', function() {
            var str = '@media only screen and (max-width: 992px){ .test1.test2:hover{ color:red }}';
            var result = {
              selectors: ['test1', 'test2'],
              style: { color: 'red'},
              state: 'hover',
              mediaText: 'only screen and (max-width: 992px)',
            };
            obj.parse(str).should.deep.equal(result);
          });

          // Phantom don't find 'node.conditionText' so will skip it
          it('Parse rule inside media query', function() {
            var str = '@media (max-width: 992px){ .test1.test2:hover{ color:red }}';
            var result = {
              selectors: ['test1', 'test2'],
              style: { color: 'red'},
              state: 'hover',
              mediaText: '(max-width: 992px)',
            };
            obj.parse(str).should.deep.equal(result);
          });

          // Phantom doesn't find 'node.conditionText' so will skip it
          it('Parse rules inside media queries', function() {
            var str = '.test1:hover{ color:white }@media (max-width: 992px){ .test1.test2:hover{ color:red } .test2{ color: blue }}';
            var result = [{
              selectors: ['test1'],
              style: { color: 'white'},
              state: 'hover',
            },{
              selectors: ['test1', 'test2'],
              style: { color: 'red'},
              state: 'hover',
              mediaText: '(max-width: 992px)',
            },{
              selectors: ['test2'],
              style: { color: 'blue'},
              mediaText: '(max-width: 992px)',
            }];
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse rules with not class-based selectors', function() {
            var str = ' .class1 .class2, div > .class3 { color:red }';
            var result = {
              selectors: [],
              selectorsAdd: '.class1 .class2, div > .class3',
              style: { color: 'red'}
            };
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse rule with mixed selectors', function() {
            var str = ' .class1 .class2, .class3, div > .class4, .class5.class6 { color:red }';
            var result = [{
              selectors: ['class3'],
              style: { color: 'red'}
            },{
              selectors: ['class5', 'class6'],
              selectorsAdd: '.class1 .class2, div > .class4',
              style: { color: 'red'}
            }];
            obj.parse(str).should.deep.equal(result);
          });

          it('Parse rule with important styles', function() {
            var str = ' .test1 {color:red !important; width: 100px; height: 10px !important}';
            var result = {
              selectors: ['test1'],
              style: {
                color: 'red !important',
                height: '10px !important',
                width: '100px',
              }
            };
            obj.parse(str).should.deep.equal(result);
          });

        });

      }
    };

});
