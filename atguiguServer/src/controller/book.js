const Base = require('./base.js');
const rp = require('request-promise');

module.exports = class extends Base {
  async getBookListAction() {
    const req = this.get('req');
    // let books = await this.model('books').where({title:req}).find();
    let books = await this.model('books')
      .where({title:{'like':`%${req}%`}})
      .limit(20)
      .select();
    return this.success(books);
  }
}
