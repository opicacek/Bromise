/*
 * Practice implementation of Promises...
 */

'use strict';
class Bromise {
  constructor() {
    this.promises = [];
    this.exceptionHandlers = [];
    this.exceptionStatus = false;
  }

  //TODO add multiple promises at once and return result of all in one array
  all(fnArray) {
    //
  }

  // add promise
  then(fn) {
    this.promises.push(fn);

    // start executing first promise
    if (this.promises.length == 1) {
      this.exec();
    }

    return this;
  }

  //TODO currently we expect "exec" method to be synchronous
  // execute promise method
  exec(param) {
    var self = this;

    // finish promise chain
    if (!self.promises.length) {
      if (self.exceptionStatus) {
        return self.reject(param);
      }
      return self.resolve(param);
    }

    // execution of promise has be asynchronous
    setTimeout( function() {
      var promise = self.promises.shift();

      if (self.exceptionStatus) {
        if (promise == 'exceptionHandler') {
          // use execptionHandler to process the error
          promise = self.exceptionHandlers.shift();
        } else {
          return self.exec(param);
        }
      } else {
        if (promise == 'exceptionHandler') {
          self.exceptionHandlers.shift();
          // end of promise chain
          return self.exec(param);
        }
      }

      self.exceptionStatus = false;


      try {
        var result = promise(param);
        self.exec(result);
      } catch (e) {
        self.exceptionStatus = true;
        self.exec(e);
      }
    }, 0);
  }

  // assign exception handler
  catch(fn) {
    this.promises.push('exceptionHandler');
    this.exceptionHandlers.push(fn);
    return this;
  }

  // return final value of promise chain in case of success
  resolve(param) {
    //TODO
  }

  // return final value of promise chain in case of failure
  reject(param) {
    //TODO
  }
}


//----- Tests -----

console.log('Before promise call check log.');

var bromiseTest = new Bromise().then( function() {
  console.log('What a nice day!');
  return 'Very lovely indeed.';
}).then( function(value) {
  console.log(value);
}).then( function(value) {
  console.log('This is why we can\'t have a nice things.');
  throw new Error('B-B-B-Breaker');
}).then( function(value) {
  console.log('I am being ignored.');
}).catch( function(err) {
  console.log('ErrorHandler: I got you covered, keep going...', err.message);
}).then( function(value) {
  console.log('Let\'s break it again...');
  throw new Error('C-C-C-Crash');
}).catch( function(err) {
  console.log('ErrorHandler: Second Error handler', err.message);
}).then( function(value) {
  console.log('I am NOT being ignored.');
});

console.log('After promise call check log.');
