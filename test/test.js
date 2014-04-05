var expect = require('expect.js');
var flatty = require("../main");
var fs = require("fs");
var rand = require("generate-key");

var data = [{
  name: "Marshall",
  username: "eminem"
}, {
  name: "Justas",
  username: "jutaz"
}]

describe('Flatty', function() {
  var db;
  fs.writeFileSync(__dirname + "/test.db", "");
  it("should return a new instance of flatty", function() {
    db = new flatty(__dirname + "/test.db", {
      interval: 20
    });
    expect(db).to.be.an("object").and.to.be.a(flatty);
    describe('#set()', function() {
      it('should add new record to DB with random ID', function(done) {
        db.set(data[0], function(id) {
          expect(id).to.be.a("string");
          data[0].id = id;
          done();
        });
      });
      it("should add new record with given ID", function(done) {
        gen = rand.generateKey();
        db.set(gen, data[1], function(id) {
          expect(id).to.be.a("string").and.to.be.equal(gen);
          data[1].id = id;
          done();
        });
      });
    });
    describe("#get()", function() {
      it("should get all records", function(done) {
        db.get(function(records) {
          expect(records).to.be.an("array");
          expect(records.length).to.be.equal(2);
          done();
        });
      });
      it("shold get one record", function(done) {
        db.get(data[0].id, function(records) {
          expect(records).to.be.an("object").and.to.be.equal(data[0]);
          done();
        });
      });
    });
    describe("#find()", function() {
      it("should find user with username = " + data[0].username, function(done) {
        db.find({
          username: data[0].username
        }, function(records) {
          expect(records).to.be.an("array");
          expect(records.length).to.be.equal(1);
          expect(records[0]).to.be.equal(data[0]);
          done();
        });
      });
    });
    describe("#delete()", function() {
      it("should delete user with username = " + data[1].username, function(done) {
        db.delete(data[1].id, function() {
          expect(db.data[data[1].id]).to.be(undefined);
          done();
        });
      });
    });
  });
});

describe("Flatty stress test", function() {
  fs.writeFileSync(__dirname + "/stress.db", "");
  var db = new flatty(__dirname + "/stress.db", {
    interval: 20
  });
  describe("#set()", function() {
    it("shold set 1000 records", function(done) {
      completed = 0;
      i = 0;
      while (i < 1000) {
        db.set({
          name: rand.generateKey(),
          password: rand.generateKey()
        }, function() {
          completed++;
          if (completed === 1000) {
            expect(Object.keys(db.data).length).to.be.equal(1000);
            done();
          }
        });
        i++;
      }
    });
    it("should set 1000000 records", function(done) {
      db.delete(function() {
        completed = 0;
        i = 0;
        while (i < 1000000) {
          db.set({
            name: rand.generateKey(),
            password: rand.generateKey()
          }, function() {
            completed++;
            if (completed === 1000000) {
              expect(Object.keys(db.data).length).to.be.equal(1000000);
              done();
            }
          });
          i++;
        }
      });
    });
  });
  describe("#get()", function() {
    it("should try to get nonexistant record", function(done) {
      db.get(rand.generateKey()+rand.generateKey(), function(record) {
        expect(record).to.be.equal(null);
        done();
      });
    });
  });
  describe("#find()", function() {
    it("should try to find nonexistant record", function(done) {
      db.find({name: rand.generateKey()+rand.generateKey()}, function(record) {
        expect(record).to.be.equal(null);
        done();
      });
    });
  });
});

after(function() {
  fs.unlinkSync(__dirname+"/test.db");
  fs.unlinkSync(__dirname+"/stress.db");
});