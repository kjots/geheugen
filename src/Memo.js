export class Memo {
    constructor({
        Q = Promise,
        singleton = true,
        dependencies = [],
        onSet = () => {},
        onReset = () => {},
        factory = () => {},
        promise,
        value
    } = {}) {
        dependencies.forEach(dependency => {
            dependency.dependants.push(this);
        });

        return Object.assign(this, { Q, singleton, dependencies, onSet, onReset, factory, promise, value, dependants: [] });
    }

    resolve() {
        if (this.singleton && this.value !== undefined) {
            return this.Q.resolve(this.value);
        }
        else if (this.promise !== undefined) {
            return this.promise;
        }
        else {
            this.promise = this.Q.all(this.dependencies.map(dependency => dependency.resolve()))
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

    get() {
        return this.value;
    }

    set(value) {
        this.resetDependants();

        this.onSet(value);

        this.value = value;
    }

    reset() {
        this.resetDependants();

        this.onReset();

        delete this.value;
    }

    resetDependants() {
        this.dependants.forEach(dependant => dependant.reset());
    }
}