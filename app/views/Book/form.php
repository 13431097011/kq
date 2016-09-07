<form role="form">
  <div class="form-group">
    <label for="exampleInputEmail1">ISBN</label>
    <input type="text" class="form-control" name="book[ISBN]" placeholder="请输入ISBN">
  </div>
  <div class="form-group">
    <label for="subtitle">书名</label>
    <input type="text" class="form-control" name="book[subtitle]" id="subtitle"  placeholder="请输入书名">
  </div>
  <div class="form-group">
    <label for="exampleInputFile">作者</label>
    <input type="text" class="form-control" name="book[subtitle]" placeholder="请输入书的作者">
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Check me out
    </label>
  </div>
  <button type="submit" class="btn btn-default">Submit</button>
</form>