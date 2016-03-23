import 'promise.prototype.finally';

export class Memo {
    constructor({
        dependencies = [],
        factory = () => {},
        promise,
        value
    } = {}) {
        dependencies.forEach(dependency => {
            dependency.dependants.push(this);
        });

        return Object.assign(this, { dependencies, factory, promise, value, dependants: [] });
    }

    resolve() {
        if (this.value !== undefined) {
            return Promise.resolve(this.value);
        }
        else if (this.promise !== undefined) {
            return this.promise;
        }
        else {
            this.promise = Promise.all(this.dependencies.map(dependency => dependency.resolve()))
                .then(this.factory)
                .then(value => {
                    this.value = value;

                    return value;
                })
                .finally(() => {
                    delete this.promise;
                });

            return this.promise;
        }
    }

    reset() {
        this.dependants.forEach(dependant => dependant.reset());

        delete this.value;
    }
}