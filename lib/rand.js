// Generated by IcedCoffeeScript 1.6.3-g
(function() {
  var BigInteger, Lock, MRF, MediumRandomFountain, SRF, StrongRandomFountain, iced, native_rng, prng, __iced_k, __iced_k_noop, _mrf, _srf;

  iced = require('iced-coffee-script/lib/coffee-script/iced').runtime;
  __iced_k = __iced_k_noop = function() {};

  BigInteger = require('bn').BigInteger;

  prng = require('triplesec').prng;

  native_rng = prng.native_rng;

  Lock = require('./lock').Lock;

  MediumRandomFountain = (function() {
    function MediumRandomFountain() {}

    MediumRandomFountain.prototype.nextBytes = function(v) {
      var b, c, i, _i, _len, _results;
      b = native_rng(v.length);
      _results = [];
      for (i = _i = 0, _len = b.length; _i < _len; i = ++_i) {
        c = b[i];
        _results.push(v[i] = c);
      }
      return _results;
    };

    MediumRandomFountain.prototype.random_word = function() {
      return native_rng(4).readUInt32BE(0);
    };

    MediumRandomFountain.prototype.random_zn = function(n) {
      var i;
      while (true) {
        i = new BigInteger(n.bitLength(), this);
        if (i.compareTo(BigInteger.ONE) > 0 && i.compareTo(n) < 0) {
          return i;
        }
      }
    };

    return MediumRandomFountain;

  })();

  _mrf = null;

  MRF = function() {
    if (_mrf == null) {
      _mrf = new MediumRandomFountain();
    }
    return _mrf;
  };

  StrongRandomFountain = (function() {
    function StrongRandomFountain() {
      this.buf = null;
      this.lock = new Lock();
    }

    StrongRandomFountain.prototype.random_word = function(cb) {
      var wa, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/rand.iced",
          funcname: "StrongRandomFountain.random_word"
        });
        prng.generate(4, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return wa = arguments[0];
            };
          })(),
          lineno: 49
        }));
        __iced_deferrals._fulfill();
      })(function() {
        return cb(wa.to_buffer().readUInt32BE(0));
      });
    };

    StrongRandomFountain.prototype.random_zn = function(n, cb) {
      var go, ret, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      go = true;
      ret = false;
      (function(__iced_k) {
        var _results, _while;
        _results = [];
        _while = function(__iced_k) {
          var _break, _continue, _next;
          _break = function() {
            return __iced_k(_results);
          };
          _continue = function() {
            return iced.trampoline(function() {
              return _while(__iced_k);
            });
          };
          _next = function(__iced_next_arg) {
            _results.push(__iced_next_arg);
            return _continue();
          };
          if (!go) {
            return _break();
          } else {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/rand.iced",
                funcname: "StrongRandomFountain.random_zn"
              });
              _this.random_nbit(n.bitLength(), __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return ret = arguments[0];
                  };
                })(),
                lineno: 58
              }));
              __iced_deferrals._fulfill();
            })(function() {
              return _next(go = (ret.compareTo(BigInteger.ONE) <= 0) || (ret.compareTo(n) >= 0));
            });
          }
        };
        _while(__iced_k);
      })(function() {
        return cb(ret);
      });
    };

    StrongRandomFountain.prototype.nextBytes = function(v) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = v.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(v[i] = this.buf[i]);
      }
      return _results;
    };

    StrongRandomFountain.prototype.random_nbit = function(nbits, cb) {
      var nbytes, ret, tmp, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/rand.iced",
          funcname: "StrongRandomFountain.random_nbit"
        });
        _this.lock.acquire(__iced_deferrals.defer({
          lineno: 71
        }));
        __iced_deferrals._fulfill();
      })(function() {
        nbytes = (nbits >> 3) + 1;
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "src/rand.iced",
            funcname: "StrongRandomFountain.random_nbit"
          });
          prng.generate(nbytes, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return tmp = arguments[0];
              };
            })(),
            lineno: 73
          }));
          __iced_deferrals._fulfill();
        })(function() {
          _this.buf = tmp.to_buffer();
          ret = new BigInteger(nbits, _this);
          _this.lock.release();
          return cb(ret);
        });
      });
    };

    return StrongRandomFountain;

  })();

  _srf = null;

  SRF = function() {
    if (_srf == null) {
      _srf = new StrongRandomFountain();
    }
    return _srf;
  };

  exports.MRF = MRF;

  exports.SRF = SRF;

}).call(this);