#include <eosiolib/eosio.hpp>
#include <eosiolib/transaction.hpp>
#include <eosiolib/crypto.h>
#include <string>
#include <vector>

using eosio::indexed_by;
using eosio::const_mem_fun;
using std::string;
using eosio::print;
using std::vector;
using eosio::permission_level;
using eosio::action;

class messaging : public eosio::contract {

    public:

    explicit messaging( action_name self )
            : contract( self ) {
    }

    //@abi action
    void newphonebook( account_name from, uint64_t book_id, string personal_seed) {
      
      //require_auth( from ); // make sure authorized by account

      phonebook_indexed books( from, _self ); // code, scope

      auto itr = books.find( book_id );

      if( itr != books.end() ) {
         std::string err = "There is already a phonebook with this id: " + std::to_string(book_id);
         eosio_assert( false, err.c_str() );
      }

      books.emplace( from /*payer*/, [&]( auto& book ) {
         book.id = book_id;
         book.name = from;
         book.seed = personal_seed;
      });

    }

    //@abi action
    void updatephonebook(account_name from, uint64_t book_id, string new_seed) {

     // require_auth( from ); // make sure authorized by account

      phonebook_indexed books( from, _self ); // code, scope

      auto itr = books.find( book_id );

      if( itr != books.end() && itr -> name == from) {

        books.modify( itr, from, [&]( auto& book ) {

          book.seed = new_seed;

        });

      } else {

         std::string err = "Could not access this phone book: " + std::to_string(book_id);
         eosio_assert( false, err.c_str() );

      }

    }

    //@abi action
    void addrequest(account_name from, account_name to, string ipfs_hash) {

      // require_auth( from ); // make sure authorized by account

      requests_indexed requests( from, _self ); // code, scope

      auto itr = requests.get_index<N(byRecipient)>();

      uint64_t found = 0;

      for( const auto& item : itr ) {
        
        if (item.for_who == to) {

          found = 1;

          itr.modify( item, from, [&]( auto& request ) {

            request.from.push_back(from);
            request.ipfshash.push_back(ipfs_hash);

          });

        }

      }

      //if(found == 0) {}

    }

    //@abi action
    void registerkey(account_name who, string pbk) {}

    //@abi action
    void newrequest(account_name sender, account_name recipient) {



    }

    //@abi action
    void registerseed(account_name sender, account_name recipient, string seed) {}

   private:

   //@abi table requests i64
   struct requests {

      uint64_t id;
      account_name recipient;
      uint64_t time_requested;
      account_name sender;

      uint64_t primary_key() const { return id; }

      account_name by_receiver() const { return for_who; } //getter for receiver of requests

    
      EOSLIB_SERIALIZE(requests, ( id )( for_who )( from )( ipfshash )( last_time_checked ));

   };

   //@abi table phonebook i64
   struct phonebook {

      uint64_t id;
      account_name sender;
      account_name recipient;
      string seed;
 //     checksum256 seed;

      uint64_t primary_key() const { return id; }

      

      EOSLIB_SERIALIZE(phonebook, );

   };

    //@abi table keys i64
   struct keys {

      uint64_t id;
      account_name who;
      string pbk;

      uint64_t primary_key() const { return id; }

      

      EOSLIB_SERIALIZE(phonebook, );

   };

   typedef eosio::multi_index<N( phonebook ), phonebook,
         
   > phonebook_indexed;

   typedef eosio::multi_index<N( requests ), requests,
         
   > requests_indexed;
  
};

EOSIO_ABI( evs, ( updatephonebook )( newphonebook )( addrequest ))