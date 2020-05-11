const Base = require('./base.js')
const rp = require('request-promise')

module.exports = class extends Base {
  async getBooksAction() {
    const req = this.get('req');
    // let books = await this.model('books').where({title:req}).find();
    let books = await this.model('books')
      .select();
    return this.success(books);
  }
}
