class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (!config) throw new Error('Config needed');
    this.config = config;
    this.state = config.initial;
    this.undos = [];
    this.history = [];
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.state;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (this.config.states[state]) {
      this.history.push(this.state);
      this.state = state;
      this.undos = [];
    } else {
      throw new Error('No such state');
    }
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (this.config.states[this.state].transitions[event]) {
      this.changeState(this.config.states[this.state].transitions[event]);
    } else {
      throw new Error('There is no event fot this state');
    }
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.state = this.config.initial;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    if (event) {
      return Object.keys(this.config.states).reduce((result, state) => {
        if (this.config.states[state].transitions[event]) result.push(state);
        return result;
      }, []);
    } else {
      return Object.keys(this.config.states);
    }
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this.history.length) {
      this.undos.push(this.state);
      this.state = this.history.pop();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (this.undos.length) {
      this.history.push(this.state);
      this.state = this.undos.pop();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.history = [];
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
