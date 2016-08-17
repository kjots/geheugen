import { Memo } from './Memo.js';

describe('Memo', () => {
    describe('constructor()', () => {
        it('should store the provided arguments', () => {
            // Given
            let Q = {};
            let singleton = false;
            let dependencies = [];
            let onReset = () => {};
            let factory = () => {};
            let promise = new Promise(() => {});
            let value = {};

            // When
            let memo = new Memo({ Q, singleton, dependencies, onReset, factory, promise, value });

            // Then
            expect(memo.Q).to.equal(Q);
            expect(memo.singleton).to.equal(singleton);
            expect(memo.dependencies).to.equal(dependencies);
            expect(memo.onReset).to.equal(onReset);
            expect(memo.factory).to.equal(factory);
            expect(memo.promise).to.equal(promise);
            expect(memo.value).to.equal(value);
            expect(memo.dependants).to.eql([]);
        });
    });

    describe('resolve()', () => {
        context('when the memo has no dependencies', () => {
            it('should invoke the factory with no arguments', () => {
                // Given
                let factory = sinon.spy();
                let memo = new Memo({ factory });

                // When
                let promise = memo.resolve();

                // Then
                return promise.then(() => {
                    expect(factory).to.have.been.calledWith();
                });
            });
        });

        context('when the memo has dependencies', () => {
            it('should invoke the factory with the resolved values of the dependencies', () => {
                // Given
                let values = [ 'testValue1', 'testValue2', 'testValue3' ];
                let dependencies = values.map(value => new Memo({ factory: () => value }));
                let factory = sinon.spy();
                let memo = new Memo({ dependencies, factory });

                // When
                let promise = memo.resolve();

                // Then
                return promise.then(() => {
                    expect(factory).to.have.been.calledWith([ 'testValue1', 'testValue2', 'testValue3' ]);
                });
            });
        });

        it('should return a promise via the factory', () => {
            // Given
            let value = {};
            let memo = new Memo({ factory: () => value });

            // When
            let promise = memo.resolve();

            // Then
            return expect(promise).to.eventually.equal(value);
        });

        it('should store the promise', () => {
            // Given
            let memo = new Memo();

            // When
            let promise = memo.resolve();

            // Then
            expect(memo.promise).to.equal(promise);
        });

        context('when the promise succeeds', () => {
            it('should store the value of the promise', () => {
                // Given
                let value = {};
                let memo = new Memo({ factory: () => value });

                // When
                let promise = memo.resolve();

                // Then
                return promise.then(value => {
                    expect(memo.value).to.equal(value);
                });
            });

            it('should remove the promise', () => {
                // Given
                let memo = new Memo();

                // When
                let promise = memo.resolve();

                return promise.then(() => {
                    expect(memo.promise).to.be.undefined;
                });
            });
        });

        context('when the promise fails', () => {
            it('should remove the promise', () => {
                // Given
                let memo = new Memo({ factory: () => Promise.reject() });

                // When
                let promise = memo.resolve();

                return promise.catch(() => {
                    expect(memo.promise).to.be.undefined;
                });
            });
        });

        context('when the memo has a promise', () => {
            it('should return the promise', () => {
                // Given
                let memo = new Memo();
                let storedPromise = memo.promise = new Promise(() => {});

                // When
                let returnedPromise = memo.resolve();

                // Then
                expect(returnedPromise).to.equal(storedPromise);
            });
        });

        context('when the memo has a value', () => {
            context('when the singleton flag is not set', () => {
                it('should return a promise via the factory', () => {
                    // Given
                    let memo = new Memo({ singleton: false, factory: () => 'Test Factory Value' });

                    memo.value = 'Test Memo Value';

                    // When
                    let promise = memo.resolve();

                    // Then
                    return expect(promise).to.eventually.equal('Test Factory Value');
                });
            });

            context('when the singleton flag is set', () => {
                it('should return a promise resolved with the value', () => {
                    // Given
                    let memo = new Memo({ singleton: true, factory: () => 'Test Factory Value' });

                    memo.value = 'Test Memo Value';

                    // When
                    let promise = memo.resolve();

                    // Then
                    return expect(promise).to.eventually.equal('Test Memo Value');
                });
            });
        });
    });

    describe('reset()', () => {
        context('when the memo has dependants', () => {
            it('should reset the dependants', () => {
                // Given
                let memo = new Memo();
                let dependants = [ 1, 2, 3 ].map(n => {
                    let dependant = new Memo({ dependencies: [ memo ] });

                    sinon.spy(dependant, 'reset');

                    return dependant;
                });

                // When
                memo.reset();

                // Then
                dependants.forEach(dependant => {
                    expect(dependant.reset).to.have.been.called;
                });
            });
        });

        it('should invoke the reset event handler', () => {
            // Given
            let memo = new Memo();

            sinon.spy(memo, 'onReset');

            // When
            memo.reset();

            // Then
            expect(memo.onReset).to.have.been.called;
        });

        it('should remove the value', () => {
            // Given
            let memo = new Memo();

            memo.value = {};

            // When
            memo.reset();

            // Then
            expect(memo.value).to.be.undefined;
        });
    });

    describe('resetDependants()', () => {
        it('should reset the dependants', () => {
            // Given
            let memo = new Memo();
            let dependants = [ 1, 2, 3 ].map(n => {
                let dependant = new Memo({ dependencies: [ memo ] });

                sinon.spy(dependant, 'reset');

                return dependant;
            });

            // When
            memo.resetDependants();

            // Then
            dependants.forEach(dependant => {
                expect(dependant.reset).to.have.been.called;
            });
        });
    });
});